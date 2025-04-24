'use client';

import { useContractContext } from '../context/ContractContext';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from './constants';

/**
 * Custom hook to read data from the contract
 * @param {string} functionName - The name of the contract function to call
 * @return {Object} Hook with execute function and status indicators
 */
export function useContractRead(functionName) {
  const { readContract, isLoading, error } = useContractContext();

  const execute = async (...args) => {
    try {
      const { data, error: readError } = await readContract(functionName, args);
      return { data, error: readError };
    } catch (error) {
      return { data: null, error: error.message };
    }
  };

  return {
    execute,
    isLoading,
    error,
  };
}

/**
 * Custom hook to write data to the contract
 * @param {string} functionName - The name of the contract function to call
 * @return {Object} Hook with execute function and status indicators
 */
export function useContractWrite(functionName) {
  const { writeContract, isLoading, error } = useContractContext();

  const execute = async (...args) => {
    try {
      const { result, error: writeError } = await writeContract(functionName, args);
      return { result, error: writeError };
    } catch (error) {
      return { result: null, error: error.message };
    }
  };

  return {
    execute,
    isLoading,
    error,
  };
}

/**
 * Get access to the contract instance
 */
export function useContract() {
  const { contract, isLoading, error } = useContractContext();
  return { contract, isLoading, error };
}

/**
 * Format address for display by truncating the middle
 * @param {string} address - Ethereum address
 * @return {string} Truncated address
 */
export function truncateAddress(address) {
  if (!address) return '';
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

/**
 * Format timestamp to human readable date
 * @param {number} timestamp - Unix timestamp in seconds
 * @return {string} Formatted date string
 */
export function formatDate(timestamp) {
  if (!timestamp) return 'N/A';
  return new Date(timestamp * 1000).toLocaleDateString();
}

/**
 * Generate specific hooks for all contract functions
 * Auto-generated from CONTRACT_ABI
 */

// ===== CUSTOMER FUNCTIONS =====
export function useRegisterCustomer() {
  return useContractWrite('registerCustomer');
}

export function useUpdateKYC() {
  return useContractWrite('updateKYC');
}

export function useDeleteKYCApplication() {
  return useContractWrite('deleteKYCApplication');
}

export function useUpdateUserProfile() {
  return useContractWrite('updateUserProfilePart1');
}

export function useUpdateUserAddress() {
  return useContractWrite('updateUserProfilePart2');
}

// ===== EMPLOYEE FUNCTIONS =====
export function useRegisterEmployee() {
  return useContractWrite('registerEmployee');
}

export function useApproveKYCByEmployee() {
  return useContractWrite('approveKYCByEmployee');
}

export function useRejectKYC() {
  return useContractWrite('rejectKYC');
}

// ===== ADMIN FUNCTIONS =====
export function useRegisterAdmin() {
  return useContractWrite('registerAdmin');
}

export function useRegisterBankHead() {
  return useContractWrite('registerBankHeadPart1');
}

export function useFinalizeBankHead() {
  return useContractWrite('registerBankHeadPart2');
}

export function useAddBank() {
  return useContractWrite('addBank');
}

export function useFinalizeKYC() {
  return useContractWrite('finalizeKYC');
}

export function useSetKYCValidityPeriod() {
  return useContractWrite('setKYCValidityPeriod');
}

// ===== READ FUNCTIONS =====
export function useGetKYCStatus() {
  return useContractRead('getKYCStatus');
}

export function useGetKYCDetails() {
  return useContractRead('getKYCDetails');
}

export function useGetUserRole() {
  return useContractRead('getUserRole');
}

export function useGetEmployeeIFSC() {
  return useContractRead('getEmployeeIFSC');
}

export function useCheckKYCExpiry() {
  return useContractWrite('checkKYCExpiry');
}

export function useGetKYCHistory() {
  return useContractRead('getKYCHistoryCount');
}

export function useGetKYCHistoryItem() {
  return useContractRead('getKYCHistoryItem');
}

export function useGetBranchEmployees() {
  return useContractRead('getBranchEmployeeCount');
}

export function useGetBranchEmployeeByIndex() {
  return useContractRead('getBranchEmployeeByIndex');
}