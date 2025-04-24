'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useWallet } from '../../../context/WalletContext';
import { KYC_STATUS, KYC_STATUS_NAMES, KYC_STATUS_COLORS } from '../../../utils/constants';
import { useContractRead, useContractWrite } from '../../../utils/contractHelpers';

export default function AdminDashboard() {
  const { address, isAdmin, isLoading: isWalletLoading } = useWallet();
  const router = useRouter();
  
  const [pendingApprovals, setPendingApprovals] = useState([]);
  const [newEmployees, setNewEmployees] = useState([]);
  const [systemStats, setSystemStats] = useState({
    totalCustomers: 0,
    totalEmployees: 0,
    totalVerifications: 0,
    totalBanks: 0
  });
  const [isDataLoading, setIsDataLoading] = useState(true);

  // Contract read hooks
  const { executeRead: getPendingApprovals, isLoading: isApprovalsLoading } = useContractRead('getPendingApprovals');
  const { executeRead: getNewEmployees, isLoading: isEmployeesLoading } = useContractRead('getNewEmployees');
  const { executeRead: getSystemStats, isLoading: isStatsLoading } = useContractRead('getSystemStats');
  
  useEffect(() => {
    // Redirect if not authenticated as admin
    if (!isWalletLoading && !isAdmin) {
      router.push('/login');
    }
    
    const fetchAdminData = async () => {
      if (!address) return;
      
      try {
        setIsDataLoading(true);
        
        // Fetch pending KYC approvals
        const { data: approvals, error: approvalsError } = await getPendingApprovals();
        if (!approvalsError) {
          setPendingApprovals(approvals);
        }
        
        // Fetch new employee registrations
        const { data: employees, error: employeesError } = await getNewEmployees();
        if (!employeesError) {
          setNewEmployees(employees);
        }
        
        // Fetch system statistics
        const { data: stats, error: statsError } = await getSystemStats();
        if (!statsError) {
          setSystemStats(stats);
        }
        
      } catch (error) {
        console.error("Error fetching admin data:", error);
      } finally {
        setIsDataLoading(false);
      }
    };
    
    if (isAdmin && address) {
      fetchAdminData();
    }
  }, [isWalletLoading, isAdmin, router, address, getPendingApprovals, getNewEmployees, getSystemStats]);
  
  const isLoading = isWalletLoading || isDataLoading || isApprovalsLoading || isEmployeesLoading || isStatsLoading;
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-48">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }
  
  if (!isAdmin) {
    return null;
  }
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
          
          {/* System Stats */}
          <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {Object.entries(systemStats).map(([key, value]) => (
              <div key={key} className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </dt>
                  <dd className="mt-1 text-3xl font-semibold text-gray-900 dark:text-white">
                    {value}
                  </dd>
                </div>
              </div>
            ))}
          </div>
          
          {/* Pending Approvals */}
          <div className="mt-8">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white">Pending KYC Approvals</h2>
            <div className="mt-4 overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Applicant</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Verified By</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Bank</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {pendingApprovals.map((approval, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {approval.applicant}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {approval.verifiedByEmployee}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {approval.verificationDate}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${KYC_STATUS_COLORS[approval.status]} text-white`}>
                          {KYC_STATUS_NAMES[approval.status]}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {approval.bank} ({approval.ifsc})
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <Link
                          href={`/dashboard/admin/approve/${approval.applicant}`}
                          className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                        >
                          Review
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          
          {/* New Employees */}
          <div className="mt-8">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white">New Employee Registrations</h2>
            <div className="mt-4 overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Address</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Bank</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {newEmployees.map((employee, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {employee.address}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {employee.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {employee.bank} ({employee.ifsc})
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {employee.registrationDate}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <Link
                          href={`/dashboard/admin/verify-employee/${employee.address}`}
                          className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                        >
                          Verify
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}