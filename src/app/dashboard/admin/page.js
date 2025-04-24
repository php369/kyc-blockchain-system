'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useWallet } from '../../../context/WalletContext';
import { KYC_STATUS, KYC_STATUS_NAMES, KYC_STATUS_COLORS } from '../../../utils/constants';
import { truncateAddress } from '../../../utils/contractHelpers';

export default function AdminDashboard() {
  const { address, isAdmin, contract, isLoading } = useWallet();
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
  
  useEffect(() => {
    // Redirect if not authenticated as admin
    if (!isLoading && !isAdmin) {
      router.push('/login');
    }
    
    const fetchAdminData = async () => {
      if (!address || !contract) return;
      
      try {
        setIsDataLoading(true);
        
        // In a real app, this would fetch from blockchain
        // For now, we use mock data
        
        // Mock pending KYC approvals
        setPendingApprovals([
          {
            applicant: '0x1234567890abcdef1234567890abcdef12345678',
            verifiedByEmployee: '0x5678901234abcdef5678901234abcdef56789012',
            verificationDate: new Date(Date.now() - 86400000 * 1).toLocaleDateString(),
            status: KYC_STATUS.VERIFIED_BY_EMPLOYEE,
            bank: 'HDFC Bank',
            ifsc: 'HDFC0001234'
          },
          {
            applicant: '0xabcdef1234567890abcdef1234567890abcdef12',
            verifiedByEmployee: '0x5678901234abcdef5678901234abcdef56789012',
            verificationDate: new Date(Date.now() - 86400000 * 2).toLocaleDateString(),
            status: KYC_STATUS.VERIFIED_BY_EMPLOYEE,
            bank: 'SBI',
            ifsc: 'SBIN0001234'
          }
        ]);
        
        // Mock new employee registrations
        setNewEmployees([
          {
            address: '0x7890abcdef1234567890abcdef1234567890abcd',
            name: 'John Doe',
            bank: 'HDFC Bank',
            ifsc: 'HDFC0001234',
            registrationDate: new Date(Date.now() - 86400000 * 1).toLocaleDateString()
          },
          {
            address: '0x3456789012abcdef3456789012abcdef34567890',
            name: 'Jane Smith',
            bank: 'SBI',
            ifsc: 'SBIN0001234',
            registrationDate: new Date(Date.now() - 86400000 * 3).toLocaleDateString()
          }
        ]);
        
        // Mock system statistics
        setSystemStats({
          totalCustomers: 156,
          totalEmployees: 23,
          totalVerifications: 87,
          totalBanks: 5
        });
        
      } catch (error) {
        console.error("Error fetching admin data:", error);
      } finally {
        setIsDataLoading(false);
      }
    };
    
    if (isAdmin && address && contract) {
      fetchAdminData();
    }
  }, [isLoading, isAdmin, router, address, contract]);
  
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
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <p className="text-gray-600">System overview and management</p>
      </header>
      
      {/* System Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 text-blue-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-gray-500 text-sm">Total Customers</p>
              <p className="text-2xl font-semibold">{systemStats.totalCustomers}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 text-green-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-gray-500 text-sm">Bank Employees</p>
              <p className="text-2xl font-semibold">{systemStats.totalEmployees}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100 text-yellow-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-gray-500 text-sm">Verifications</p>
              <p className="text-2xl font-semibold">{systemStats.totalVerifications}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100 text-purple-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-gray-500 text-sm">Banks</p>
              <p className="text-2xl font-semibold">{systemStats.totalBanks}</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <Link
            href="/admin/users"
            className="bg-blue-50 hover:bg-blue-100 p-4 rounded-lg border border-blue-200 flex flex-col items-center justify-center text-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
            <span className="font-medium">Add User</span>
            <span className="text-sm text-gray-600 mt-1">Create new customer or employee</span>
          </Link>
          
          <Link
            href="/admin/banks"
            className="bg-purple-50 hover:bg-purple-100 p-4 rounded-lg border border-purple-200 flex flex-col items-center justify-center text-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-purple-600 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            <span className="font-medium">Add Bank</span>
            <span className="text-sm text-gray-600 mt-1">Register new bank branch</span>
          </Link>
          
          <Link
            href="/dashboard/admin/approvals"
            className="bg-green-50 hover:bg-green-100 p-4 rounded-lg border border-green-200 flex flex-col items-center justify-center text-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="font-medium">KYC Approvals</span>
            <span className="text-sm text-gray-600 mt-1">Review pre-verified KYC applications</span>
          </Link>
          
          <Link
            href="/admin/stats"
            className="bg-yellow-50 hover:bg-yellow-100 p-4 rounded-lg border border-yellow-200 flex flex-col items-center justify-center text-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-yellow-600 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <span className="font-medium">System Stats</span>
            <span className="text-sm text-gray-600 mt-1">View detailed system analytics</span>
          </Link>
        </div>
      </div>
      
      {/* Pending KYC Final Approvals */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-6">
          <h2 className="text-lg font-semibold">Pending KYC Final Approvals</h2>
          <p className="text-gray-600 text-sm">
            Applications that have been verified by bank employees and require your approval
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
                  Verified By
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Bank / IFSC
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Verification Date
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {pendingApprovals.length > 0 ? (
                pendingApprovals.map((app, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-mono text-sm">{truncateAddress(app.applicant)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-mono text-sm">{truncateAddress(app.verifiedByEmployee)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{app.bank}</div>
                      <div className="text-sm text-gray-500">{app.ifsc}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{app.verificationDate}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link 
                        href={`/kyc/approve/${app.applicant}`}
                        className="text-blue-600 hover:text-blue-900 mr-4"
                      >
                        Review
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                    No pending approvals found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        <div className="p-4 bg-gray-50 text-right">
          <Link 
            href="/dashboard/admin/approvals"
            className="text-blue-600 hover:text-blue-900 text-sm font-medium"
          >
            View all pending approvals →
          </Link>
        </div>
      </div>
      
      {/* New Employee Registrations */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-6">
          <h2 className="text-lg font-semibold">New Employee Registrations</h2>
          <p className="text-gray-600 text-sm">
            New bank employees awaiting approval
          </p>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Employee
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Wallet Address
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Bank / IFSC
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Registration Date
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {newEmployees.length > 0 ? (
                newEmployees.map((employee, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{employee.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-mono text-sm">{truncateAddress(employee.address)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{employee.bank}</div>
                      <div className="text-sm text-gray-500">{employee.ifsc}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{employee.registrationDate}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => approveEmployee(employee.address)}
                        className="text-green-600 hover:text-green-900 mr-3"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => rejectEmployee(employee.address)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Reject
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                    No new employee registrations
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        <div className="p-4 bg-gray-50 text-right">
          <Link 
            href="/admin/employees"
            className="text-blue-600 hover:text-blue-900 text-sm font-medium"
          >
            View all employees →
          </Link>
        </div>
      </div>
    </div>
  );
}