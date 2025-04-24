'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useWallet } from '../../../context/WalletContext';
import KYCStatus from '../../../components/kyc/KYCStatus';

export default function KYCStatusPage() {
  const { isCustomer, isLoading } = useWallet();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showSuccess, setShowSuccess] = useState(false);
  
  useEffect(() => {
    // Redirect if not authenticated as customer
    if (!isLoading && !isCustomer) {
      router.push('/login');
    }
    
    // Check for submission success
    const submissionStatus = searchParams.get('submission');
    if (submissionStatus === 'success') {
      setShowSuccess(true);
      
      // Hide success message after 5 seconds
      const timer = setTimeout(() => {
        setShowSuccess(false);
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [isLoading, isCustomer, router, searchParams]);
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-48">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }
  
  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">KYC Verification Status</h1>
        <p className="text-gray-600">
          Track the status of your KYC verification application
        </p>
      </div>
      
      {showSuccess && (
        <div className="mb-8 p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-green-800">
                KYC Application Submitted Successfully
              </h3>
              <div className="mt-2 text-sm text-green-700">
                <p>
                  Your KYC application has been submitted successfully and is now pending review by the bank. You can track the status here.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <KYCStatus />
      
      <div className="mt-8 bg-gray-50 p-4 rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold mb-2">KYC Verification Process</h3>
        <ol className="list-decimal pl-5 space-y-2 text-sm">
          <li><span className="font-medium">Submission:</span> Customer submits KYC application with required documents</li>
          <li><span className="font-medium">Bank Verification:</span> Bank employee reviews and verifies the submitted documents</li>
          <li><span className="font-medium">Admin Approval:</span> Bank admin gives final approval for the verified KYC</li>
          <li><span className="font-medium">Completion:</span> KYC verification is completed and valid for 2 years</li>
        </ol>
      </div>
    </div>
  );
}