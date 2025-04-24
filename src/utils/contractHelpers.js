'use client';

import { useContract, useContractRead, useContractWrite } from '@thirdweb-dev/react';
import { CONTRACT_ADDRESS } from './constants';

/**
 * Helper to get contract instance
 */
export function useKYCContract() {
  return useContract(CONTRACT_ADDRESS);
}

/**
 * Get user role from contract
 * @param {string} address - Wallet address to check
 */
export function useUserRole(address) {
  const { contract } = useKYCContract();
  
  return useContractRead(
    contract,
    "getUserRole",
    address ? [address] : undefined,
    {
      enabled: !!address && !!contract,
    }
  );
}

/**
 * Get KYC details for a user
 * @param {string} address - Wallet address to check
 */
export function useKYCDetails(address) {
  const { contract } = useKYCContract();
  
  return useContractRead(
    contract,
    "getKYCDetails",
    address ? [address] : undefined,
    {
      enabled: !!address && !!contract,
    }
  );
}

/**
 * Submit KYC application
 */
export function useSubmitKYC() {
  const { contract } = useKYCContract();
  return useContractWrite(contract, "submitKYC");
}

/**
 * Update IPFS document hash
 */
export function useUpdateIPFSHash() {
  const { contract } = useKYCContract();
  return useContractWrite(contract, "updateIPFSHash");
}

/**
 * Verify KYC (employee)
 */
export function useVerifyKYC() {
  const { contract } = useKYCContract();
  return useContractWrite(contract, "verifyKYC");
}

/**
 * Re-verify KYC (admin)
 */
export function useReverifyKYC() {
  const { contract } = useKYCContract();
  return useContractWrite(contract, "reverifyKYC");
}

/**
 * Reject KYC application
 */
export function useRejectKYC() {
  const { contract } = useKYCContract();
  return useContractWrite(contract, "rejectKYC");
}

/**
 * Check KYC expiry
 */
export function useCheckExpiry() {
  const { contract } = useKYCContract();
  return useContractWrite(contract, "checkExpiry");
}

/**
 * Add customer
 */
export function useAddCustomer() {
  const { contract } = useKYCContract();
  return useContractWrite(contract, "addCustomer");
}

/**
 * Add bank employee
 */
export function useAddBankEmployee() {
  const { contract } = useKYCContract();
  return useContractWrite(contract, "addBankEmployee");
}

/**
 * Add admin
 */
export function useAddAdmin() {
  const { contract } = useKYCContract();
  return useContractWrite(contract, "addAdmin");
}

/**
 * Get employees for a specific IFSC code
 * @param {string} ifscCode - IFSC code to check
 */
export function useGetIFSCEmployees(ifscCode) {
  const { contract } = useKYCContract();
  
  return useContractRead(
    contract,
    "getIFSCEmployees",
    ifscCode ? [ifscCode] : undefined,
    {
      enabled: !!ifscCode && !!contract,
    }
  );
}

/**
 * Helper function to format timestamp to readable date
 * @param {number} timestamp - Unix timestamp
 * @returns {string} Formatted date string
 */
export function formatDate(timestamp) {
  if (!timestamp) return 'N/A';
  
  const date = new Date(Number(timestamp) * 1000);
  return date.toLocaleDateString('en-IN', { 
    day: 'numeric', 
    month: 'short', 
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

/**
 * Helper to truncate wallet address for display
 * @param {string} address - Wallet address
 * @returns {string} Truncated address
 */
export function truncateAddress(address) {
  if (!address) return '';
  return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
}

/**
 * Helper function to handle contract errors
 * @param {Error} error - Contract error
 * @returns {string} User-friendly error message
 */
export function getContractErrorMessage(error) {
  console.error('Contract error:', error);
  
  if (!error) return 'An unknown error occurred';
  
  // Extract error message from contract error
  if (error.reason) return error.reason;
  
  // Check for common error patterns in message
  const message = error.message || '';
  
  if (message.includes('user rejected transaction')) {
    return 'Transaction was rejected in your wallet';
  }
  
  if (message.includes('insufficient funds')) {
    return 'Insufficient funds for transaction';
  }
  
  if (message.includes('execution reverted')) {
    const revertReason = message.match(/execution reverted: (.*?)(?:\"|$)/);
    return revertReason?.[1] || 'Transaction failed';
  }
  
  return 'Transaction failed. Please try again.';
}