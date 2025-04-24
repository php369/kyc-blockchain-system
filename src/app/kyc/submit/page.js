'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useWallet } from '../../../context/WalletContext';
import KYCForm from '../../../components/kyc/KYCForm';

export default function SubmitKYCPage() {
  const { isCustomer, isLoading } = useWallet();
  const router = useRouter();
  
  useEffect(() => {
    // Redirect if not authenticated as customer
    if (!isLoading && !isCustomer) {
      router.push('/login');
    }
  }, [isLoading, isCustomer, router]);
  
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
        <h1 className="text-2xl font-bold mb-2">Submit KYC Application</h1>
        <p className="text-gray-600">
          Upload your documents for KYC verification. Your identity will be verified by the bank.
        </p>
      </div>
      
      <KYCForm />
      
      <div className="mt-8 bg-blue-50 p-4 rounded-lg border border-blue-200">
        <h3 className="text-lg font-semibold mb-2">Important Notice</h3>
        <ul className="list-disc pl-5 space-y-2 text-sm">
          <li>Please ensure that your Aadhaar card is clearly visible and all details are legible.</li>
          <li>Only PDF, JPG, JPEG, and PNG file formats are accepted.</li>
          <li>Maximum file size allowed is 5MB.</li>
          <li>Your documents are stored securely on IPFS with blockchain verification.</li>
          <li>The verification process usually takes 1-3 business days.</li>
        </ul>
      </div>
    </div>
  );
}