'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useWallet } from '../../../context/WalletContext';
import { KYC_STATUS, KYC_STATUS_NAMES, KYC_STATUS_COLORS } from '../../../utils/constants';
import { truncateAddress } from '../../../utils/contractHelpers';

export default function EmployeeDashboard() {
  const { address, isEmployee, contract, isLoading } = useWallet();
  const router = useRouter();
  
  const [pendingApplications, setPendingApplications] = useState([]);
  const [recentVerifications, setRecentVerifications] = useState([]);
  const [dashboardStats, setDashboardStats] = useState({
    pendingCount: 0,
    verifiedCount: 0,
    rejectedCount: 0
  });
  const [employeeInfo, setEmployeeInfo] = useState({
    branch: '',
    ifsc: ''
  });
  const [isDataLoading, setIsDataLoading] = useState(true);
  
  useEffect(() => {
    // Redirect if not authenticated as employee
    if (!isLoading && !isEmployee) {
      router.push('/login');
    }
    
    const fetchEmployeeData = async () => {
      if (!address || !contract) return;
      
      try {
        setIsDataLoading(true);
        
        // In a real app, this would fetch from blockchain and/or database
        // For now, we use mock data
        
        // Get employee branch information
        // In real implementation, this would be: const userData = await contract.users(address);
        setEmployeeInfo({
          branch: 'Main Branch',
          ifsc: 'SBIN0001234'
        });
        
        // Mock pending applications
        setPendingApplications([
          {
            applicant: '0x1234567890abcdef1234567890abcdef12345678',
            submissionDate: new Date(Date.now() - 86400000 * 2).toLocaleDateString(),
            status: KYC_STATUS.PENDING
          },
          {
            applicant: '0xabcdef1234567890abcdef1234567890abcdef12',
            submissionDate: new Date(Date.now() - 86400000 * 1).toLocaleDateString(),
            status: KYC_STATUS.PENDING
          },
          {
            applicant: '0x7890abcdef1234567890abcdef1234567890abcd',
            submissionDate: new Date(Date.now() - 86400000 * 3).toLocaleDateString(),
            status: KYC_STATUS.PENDING
          }
        ]);
        
        // Mock recent verifications
        setRecentVerifications([
          {
            applicant: '0x234567890abcdef1234567890abcdef123456789',
            verificationDate: new Date(Date.now() - 86400000 * 1).toLocaleDateString(),
            status: KYC_STATUS.VERIFIED_BY_EMPLOYEE
          },
          {
            applicant: '0x567890abcdef1234567890abcdef1234567890ab',
            verificationDate: new Date(Date.now() - 86400000 * 2).toLocaleDateString(),
            status: KYC_STATUS.REJECTED
          }
        ]);
        
        // Mock dashboard stats
        setDashboardStats({
          pendingCount: 3,
          verifiedCount: 12,
          rejectedCount: 2
        });
        
      } catch (error) {
        console.error("Error fetching employee data:", error);
      } finally {
        setIsDataLoading(false);
      }
    };
    
    if (isEmployee && address && contract) {
      fetchEmployeeData();
    }
  }, [isLoading, isEmployee, router, address, contract]);
  
  if (isLoading || isDataLoading) {
    return (
      <div className="flex justify-center items-center h-48">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold">Employee Dashboard</h1>
        <p className="text-gray-600">
          Branch: {employeeInfo.branch} | IFSC: {employeeInfo.ifsc}
        </p>
      </header>
      
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 text-blue-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-gray-500 text-sm">Pending Applications</p>
              <p className="text-2xl font-semibold">{dashboardStats.pendingCount}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 text-green-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-gray-500 text-sm">Verified Applications</p>
              <p className="text-2xl font-semibold">{dashboardStats.verifiedCount}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-red-100 text-red-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-gray-500 text-sm">Rejected Applications</p>
              <p className="text-2xl font-semibold">{dashboardStats.rejectedCount}</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Pending Applications */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-6">
          <h2 className="text-lg font-semibold">Pending Applications</h2>
          <p className="text-gray-600 text-sm">
            Applications awaiting your review from your branch
          </p>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Applicant
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Submission Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {pendingApplications.length > 0 ? (
                pendingApplications.map((app, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-mono text-sm">{truncateAddress(app.applicant)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{app.submissionDate}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${KYC_STATUS_COLORS[app.status]} text-white`}>
                        {KYC_STATUS_NAMES[app.status]}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link 
                        href={`/kyc/review/${app.applicant}`}
                        className="text-blue-600 hover:text-blue-900 mr-4"
                      >
                        Review
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="px-6 py-4 text-center text-gray-500">
                    No pending applications found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        <div className="p-4 bg-gray-50 text-right">
          <Link 
            href="/dashboard/employee/pending"
            className="text-blue-600 hover:text-blue-900 text-sm font-medium"
          >
            View all pending applications →
          </Link>
        </div>
      </div>
      
      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-6">
          <h2 className="text-lg font-semibold">Recent Verifications</h2>
          <p className="text-gray-600 text-sm">
            Your recent verification activities
          </p>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Applicant
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Verification Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {recentVerifications.length > 0 ? (
                recentVerifications.map((activity, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-mono text-sm">{truncateAddress(activity.applicant)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{activity.verificationDate}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${KYC_STATUS_COLORS[activity.status]} text-white`}>
                        {KYC_STATUS_NAMES[activity.status]}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link 
                        href={`/kyc/view/${activity.applicant}`}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="px-6 py-4 text-center text-gray-500">
                    No recent verification activities
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        <div className="p-4 bg-gray-50 text-right">
          <Link 
            href="/dashboard/employee/verified"
            className="text-blue-600 hover:text-blue-900 text-sm font-medium"
          >
            View all verification activities →
          </Link>
        </div>
      </div>
    </div>
  );
}