'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useWallet } from '../../../../context/WalletContext';
import KYCReviewForm from '../../../../components/kyc/KYCReviewForm';

export default function KYCReviewPage({ params }) {
  const { address } = params;
  const { isEmployee, isAdmin, isLoading } = useWallet();
  const router = useRouter();
  
  useEffect(() => {
    // Redirect if not authenticated as employee or admin
    if (!isLoading && !(isEmployee || isAdmin)) {
      router.push('/login');
    }
  }, [isLoading, isEmployee, isAdmin, router]);
  
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
        <h1 className="text-2xl font-bold mb-2">Review KYC Application</h1>
        <p className="text-gray-600">
          Please review the submitted documents and applicant information
        </p>
      </div>
      
      <KYCReviewForm applicantAddress={address} />
    </div>
  );
}