'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useWallet } from '../../../context/WalletContext';
import KYCStatus from '../../../components/kyc/KYCStatus';
import { formatDate } from '../../../utils/contractHelpers';

export default function CustomerDashboard() {
  const { address, isCustomer, isLoading } = useWallet();
  const router = useRouter();
  const [userInfo, setUserInfo] = useState({
    name: 'Loading...',
    email: 'Loading...',
    registrationDate: 'Loading...'
  });
  
  useEffect(() => {
    // Redirect if not authenticated as customer
    if (!isLoading && !isCustomer) {
      router.push('/login');
    }
    
    // In a real app, fetch user profile data from a database or IPFS
    // This is just placeholder data
    if (address) {
      setUserInfo({
        name: 'John Doe',
        email: 'john.doe@example.com',
        registrationDate: formatDate(Date.now() / 1000 - 86400 * 30) // 30 days ago
      });
    }
  }, [isLoading, isCustomer, router, address]);
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-48">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold">Customer Dashboard</h1>
        <p className="text-gray-600">Welcome back, {userInfo.name}</p>
      </header>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile Summary Card */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Account Information</h2>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-gray-500">Wallet Address</p>
              <p className="font-mono text-sm">{address}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p>{userInfo.email}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Registered Since</p>
              <p>{userInfo.registrationDate}</p>
            </div>
          </div>
          <div className="mt-4">
            <Link 
              href="/profile"
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              View full profile →
            </Link>
          </div>
        </div>
        
        {/* KYC Status Section - Using KYCStatus component */}
        <div className="md:col-span-2">
          <KYCStatus />
        </div>
      </div>
      
      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <Link
            href="/kyc/submit"
            className="bg-blue-50 hover:bg-blue-100 p-4 rounded-lg border border-blue-200 flex flex-col items-center justify-center text-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            <span className="font-medium">Submit KYC</span>
            <span className="text-sm text-gray-600 mt-1">Upload your documents for verification</span>
          </Link>
          
          <Link
            href="/kyc/status"
            className="bg-green-50 hover:bg-green-100 p-4 rounded-lg border border-green-200 flex flex-col items-center justify-center text-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="font-medium">Check Status</span>
            <span className="text-sm text-gray-600 mt-1">View your KYC verification status</span>
          </Link>
          
          <Link
            href="/help"
            className="bg-purple-50 hover:bg-purple-100 p-4 rounded-lg border border-purple-200 flex flex-col items-center justify-center text-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-purple-600 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="font-medium">Help Center</span>
            <span className="text-sm text-gray-600 mt-1">Get help with the KYC process</span>
          </Link>
        </div>
      </div>
      
      {/* Activity Timeline */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
        
        <div className="space-y-4">
          {/* This would be populated from blockchain events in a real implementation */}
          <div className="flex">
            <div className="mr-4 flex-shrink-0">
              <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </div>
            </div>
            <div>
              <p className="font-medium">KYC Submitted</p>
              <p className="text-sm text-gray-500">You submitted your KYC documents for verification</p>
              <p className="text-xs text-gray-400 mt-1">3 days ago</p>
            </div>
          </div>
          
          <div className="flex">
            <div className="mr-4 flex-shrink-0">
              <div className="h-8 w-8 rounded-full bg-yellow-100 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
            </div>
            <div>
              <p className="font-medium">KYC Reviewed</p>
              <p className="text-sm text-gray-500">Your KYC application is being reviewed by a bank employee</p>
              <p className="text-xs text-gray-400 mt-1">2 days ago</p>
            </div>
          </div>
          
          <div className="flex">
            <div className="mr-4 flex-shrink-0">
              <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
            <div>
              <p className="font-medium">Employee Verification</p>
              <p className="text-sm text-gray-500">Your KYC was verified by a bank employee</p>
              <p className="text-xs text-gray-400 mt-1">1 day ago</p>
            </div>
          </div>
        </div>
        
        <div className="mt-4 text-center">
          <Link 
            href="/activity"
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            View all activity →
          </Link>
        </div>
      </div>
    </div>
  );
}