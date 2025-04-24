'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useWallet } from '../../context/WalletContext';
import { IPFS_GATEWAY_URL, KYC_STATUS, KYC_STATUS_NAMES } from '../../utils/constants';
import { useVerifyKYC, useRejectKYC } from '../../utils/contractHelpers';
import FormInput from '../FormInput';

export default function KYCReviewForm({ applicantAddress }) {
  const router = useRouter();
  const { address, isEmployee, contract } = useWallet();
  
  const [kycDetails, setKycDetails] = useState(null);
  const [applicantInfo, setApplicantInfo] = useState({
    name: '',
    email: '',
    phone: '',
    addressLine1: '',
    city: '',
    state: '',
    pinCode: ''
  });
  const [documentUrl, setDocumentUrl] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionSuccess, setActionSuccess] = useState(null);
  
  // Contract write hooks
  const { execute: verifyKYC, isLoading: isVerifying } = useVerifyKYC();
  const { execute: rejectKYC, isLoading: isRejecting } = useRejectKYC();
  
  useEffect(() => {
    const fetchKYCDetails = async () => {
      if (!contract || !applicantAddress) return;
      
      try {
        setIsLoading(true);
        
        // Fetch KYC details from blockchain
        const details = await contract.getKYCDetails(applicantAddress);
        setKycDetails({
          status: Number(details.status),
          ipfsHash: details.ipfsHash,
          expiryDate: details.expiry ? new Date(Number(details.expiry) * 1000) : null
        });
        
        // If there's an IPFS hash, set document URL
        if (details.ipfsHash) {
          setDocumentUrl(`${IPFS_GATEWAY_URL}${details.ipfsHash}`);
        }
        
        // In a real app, fetch applicant information from a database or IPFS
        // This is mock data for illustration
        setApplicantInfo({
          name: 'John Doe',
          email: 'john.doe@example.com',
          phone: '+91 9876543210',
          addressLine1: '123 Main Street',
          city: 'Mumbai',
          state: 'Maharashtra',
          pinCode: '400001'
        });
        
      } catch (err) {
        console.error("Error fetching KYC details:", err);
        setError("Failed to load KYC details. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchKYCDetails();
  }, [contract, applicantAddress]);
  
  const handleApprove = async () => {
    try {
      await verifyKYC(applicantAddress);
      setActionSuccess("KYC application approved successfully");
      
      // Redirect after successful action
      setTimeout(() => {
        router.push('/dashboard/employee');
      }, 2000);
    } catch (err) {
      console.error("Error approving KYC:", err);
      setError("Failed to approve KYC. Please try again.");
    }
  };
  
  const handleReject = async () => {
    if (!rejectionReason.trim()) {
      setError("Please provide a reason for rejection");
      return;
    }
    
    try {
      await rejectKYC(applicantAddress, rejectionReason);
      setActionSuccess("KYC application rejected successfully");
      
      // Redirect after successful action
      setTimeout(() => {
        router.push('/dashboard/employee');
      }, 2000);
    } catch (err) {
      console.error("Error rejecting KYC:", err);
      setError("Failed to reject KYC. Please try again.");
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-48">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }
  
  if (error && !kycDetails) {
    return (
      <div className="bg-white shadow rounded-lg p-6">
        <div className="text-red-600 mb-4">{error}</div>
        <button
          onClick={() => router.back()}
          className="px-4 py-2 bg-gray-200 rounded-md text-gray-700 hover:bg-gray-300"
        >
          Go Back
        </button>
      </div>
    );
  }
  
  if (!kycDetails) {
    return (
      <div className="bg-white shadow rounded-lg p-6">
        <p className="text-gray-600">No KYC application found for this address.</p>
        <button
          onClick={() => router.back()}
          className="mt-4 px-4 py-2 bg-gray-200 rounded-md text-gray-700 hover:bg-gray-300"
        >
          Go Back
        </button>
      </div>
    );
  }
  
  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-6">Review KYC Application</h2>
      
      {actionSuccess && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-md text-green-700">
          {actionSuccess}
        </div>
      )}
      
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md text-red-700">
          {error}
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <h3 className="text-lg font-medium mb-4">Applicant Information</h3>
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium text-gray-500">Wallet Address</p>
              <p className="font-mono">{applicantAddress}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Name</p>
              <p>{applicantInfo.name}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Email</p>
              <p>{applicantInfo.email}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Phone</p>
              <p>{applicantInfo.phone}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Address</p>
              <p>{applicantInfo.addressLine1}, {applicantInfo.city}, {applicantInfo.state}, {applicantInfo.pinCode}</p>
            </div>
          </div>
        </div>
        
        <div>
          <h3 className="text-lg font-medium mb-4">Application Status</h3>
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium text-gray-500">Current Status</p>
              <p className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium ${
                kycDetails.status === KYC_STATUS.PENDING ? 'bg-blue-100 text-blue-800' :
                kycDetails.status === KYC_STATUS.VERIFIED_BY_EMPLOYEE ? 'bg-yellow-100 text-yellow-800' :
                kycDetails.status === KYC_STATUS.REJECTED ? 'bg-red-100 text-red-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {KYC_STATUS_NAMES[kycDetails.status]}
              </p>
            </div>
            
            <div>
              <p className="text-sm font-medium text-gray-500">Document</p>
              {documentUrl ? (
                <div className="mt-2">
                  <a 
                    href={documentUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    View Document
                  </a>
                  <p className="text-xs text-gray-500 mt-1">Click to view the uploaded Aadhaar card</p>
                </div>
              ) : (
                <p className="text-red-600">Document not available</p>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Document Preview (in real implementation, this would render the document) */}
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-4">Document Preview</h3>
        <div className="border border-gray-200 rounded-md p-4 bg-gray-50 h-64 flex items-center justify-center">
          {documentUrl ? (
            <div className="text-center">
              <p className="text-gray-600 mb-4">Document preview would appear here in a real implementation</p>
              <a 
                href={documentUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Open Document
              </a>
            </div>
          ) : (
            <p className="text-gray-600">Document not available</p>
          )}
        </div>
      </div>
      
      {/* Action Buttons */}
      {kycDetails.status === KYC_STATUS.PENDING && (
        <div className="space-y-4">
          <div className="border-t border-gray-200 pt-4">
            <h3 className="text-lg font-medium mb-4">Review Decision</h3>
            <div className="mb-4">
              <FormInput
                id="rejectionReason"
                label="Rejection Reason (required if rejecting)"
                type="textarea"
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="Provide a reason if you're rejecting this application..."
              />
            </div>
            
            <div className="flex space-x-4">
              <button
                onClick={handleApprove}
                disabled={isVerifying || isRejecting}
                className={`px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 ${
                  (isVerifying || isRejecting) ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {isVerifying ? 'Approving...' : 'Approve KYC'}
              </button>
              
              <button
                onClick={handleReject}
                disabled={isVerifying || isRejecting}
                className={`px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 ${
                  (isVerifying || isRejecting) ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {isRejecting ? 'Rejecting...' : 'Reject KYC'}
              </button>
              
              <button
                onClick={() => router.back()}
                disabled={isVerifying || isRejecting}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      
      {kycDetails.status !== KYC_STATUS.PENDING && (
        <div className="flex justify-end">
          <button
            onClick={() => router.back()}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
          >
            Go Back
          </button>
        </div>
      )}
    </div>
  );
}