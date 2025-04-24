'use client';

import { useEffect, useState } from 'react';
import { KYC_STATUS, KYC_STATUS_NAMES } from '../../utils/constants';
import { useWallet } from '../../context/WalletContext';
import { useContractContext } from '../../context/ContractContext';
import Link from 'next/link';

export default function KYCStatus({ userAddress }) {
  const { address, isCustomer } = useWallet();
  const { readContract, writeContract } = useContractContext();
  const [kycDetails, setKycDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formattedDate, setFormattedDate] = useState({
    submission: '',
    expiry: ''
  });
  
  // Use the provided address or the connected wallet address
  const targetAddress = userAddress || address;
  
  // Fetch KYC details
  useEffect(() => {
    const fetchKYCDetails = async () => {
      if (!targetAddress) return;
      
      try {
        setIsLoading(true);
        const { data, error } = await readContract('getKYCDetails', [targetAddress]);
        
        if (error) {
          throw new Error(error);
        }
        
        setKycDetails(data);
        
        // Format dates for display
        const submissionDate = new Date(Number(data.submissionDate || 0) * 1000);
        const expiryDate = new Date(Number(data.expiry || 0) * 1000);
        
        setFormattedDate({
          submission: submissionDate.getTime() > 0 
            ? submissionDate.toLocaleDateString('en-IN', { 
                day: 'numeric', month: 'short', year: 'numeric' 
              })
            : 'N/A',
          expiry: expiryDate.getTime() > 0 
            ? expiryDate.toLocaleDateString('en-IN', { 
                day: 'numeric', month: 'short', year: 'numeric' 
              })
            : 'N/A',
        });
      } catch (error) {
        console.error("Error fetching KYC details:", error);
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchKYCDetails();
  }, [targetAddress, readContract]);
  
  // Check if KYC is expired
  useEffect(() => {
    const checkExpiry = async () => {
      if (!targetAddress) return;
      
      try {
        const { error } = await writeContract('checkExpiry', [targetAddress]);
        if (error) {
          throw new Error(error);
        }
        // Refresh KYC details after checking expiry
        const { data } = await readContract('getKYCDetails', [targetAddress]);
        setKycDetails(data);
      } catch (error) {
        console.error("Error checking KYC expiry:", error);
      }
    };
    
    checkExpiry();
  }, [targetAddress, readContract, writeContract]);
  
  const getStatusColor = (status) => {
    switch (Number(status)) {
      case KYC_STATUS.PENDING:
        return 'bg-blue-500';
      case KYC_STATUS.VERIFIED_BY_EMPLOYEE:
        return 'bg-yellow-500';
      case KYC_STATUS.REVERIFIED_BY_ADMIN:
        return 'bg-green-500';
      case KYC_STATUS.REJECTED:
        return 'bg-red-500';
      case KYC_STATUS.EXPIRED:
        return 'bg-orange-500';
      default:
        return 'bg-gray-500';
    }
  };
  
  const getStatusText = (status) => {
    return KYC_STATUS_NAMES[Number(status)] || 'Unknown Status';
  };
  
  const handleDeleteApplication = async () => {
    try {
      const { error } = await writeContract('deleteKYCApplication', []);
      if (error) {
        throw new Error(error);
      }
      // Refresh KYC details after deletion
      const { data } = await readContract('getKYCDetails', [targetAddress]);
      setKycDetails(data);
    } catch (error) {
      console.error("Error deleting KYC application:", error);
    }
  };
  
  if (isLoading) {
    return (
      <div className="bg-white shadow rounded-lg p-6">
        <div className="animate-pulse flex flex-col">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="bg-white shadow rounded-lg p-6">
        <div className="text-red-500">
          Error loading KYC status. Please try again later.
        </div>
      </div>
    );
  }
  
  if (!kycDetails || (!kycDetails.status && kycDetails.status !== 0)) {
    return (
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">KYC Status</h2>
        <p className="text-gray-600">No KYC application found.</p>
        
        {isCustomer && (
          <div className="mt-4">
            <Link 
              href="/kyc/submit"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
            >
              Submit KYC
            </Link>
          </div>
        )}
      </div>
    );
  }
  
  const status = Number(kycDetails.status);
  
  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-4">KYC Status</h2>
      
      <div className="mb-6">
        <div className="flex items-center">
          <div className={`w-4 h-4 rounded-full ${getStatusColor(status)} mr-2`}></div>
          <span className="font-medium">{getStatusText(status)}</span>
        </div>
      </div>
      
      <div className="space-y-4">
        <div>
          <h3 className="text-sm font-medium text-gray-500">Submission Date</h3>
          <p className="mt-1">{formattedDate.submission}</p>
        </div>
        
        {(status === KYC_STATUS.REVERIFIED_BY_ADMIN || status === KYC_STATUS.EXPIRED) && (
          <div>
            <h3 className="text-sm font-medium text-gray-500">Expiry Date</h3>
            <p className="mt-1">{formattedDate.expiry}</p>
          </div>
        )}
        
        {status === KYC_STATUS.REJECTED && kycDetails.rejectionReason && (
          <div>
            <h3 className="text-sm font-medium text-gray-500">Rejection Reason</h3>
            <p className="mt-1 text-red-600">{kycDetails.rejectionReason}</p>
          </div>
        )}
      </div>
      
      {/* Actions based on status */}
      {isCustomer && (
        <div className="mt-6 space-y-3">
          {status === KYC_STATUS.REJECTED && (
            <Link 
              href="/kyc/submit"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
            >
              Resubmit KYC
            </Link>
          )}
          
          {status === KYC_STATUS.EXPIRED && (
            <Link 
              href="/kyc/submit"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
            >
              Renew KYC
            </Link>
          )}
          
          {(status === KYC_STATUS.PENDING || status === KYC_STATUS.REJECTED) && (
            <button 
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              onClick={handleDeleteApplication}
            >
              Delete Application
            </button>
          )}
        </div>
      )}
    </div>
  );
}