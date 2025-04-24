'use client';

import { useContractContext } from '../context/ContractContext';
import { CONTRACT_ADDRESS } from './constants';

export function useContractRead(functionName, args = []) {
  const { readContract, isLoading, error } = useContractContext();

  const executeRead = async () => {
    try {
      const { data, error: readError } = await readContract(functionName, args);
      return { data, error: readError };
    } catch (error) {
      return { data: null, error: error.message };
    }
  };

  return {
    data: null,
    isLoading,
    error,
    executeRead,
  };
}

export function useContractWrite(functionName, args = []) {
  const { writeContract, isLoading, error } = useContractContext();

  const executeWrite = async () => {
    try {
      const { result, error: writeError } = await writeContract(functionName, args);
      return { result, error: writeError };
    } catch (error) {
      return { result: null, error: error.message };
    }
  };

  return {
    isLoading,
    error,
    executeWrite,
  };
}

export function useContract() {
  const { contract, isLoading, error } = useContractContext();
  return { contract, isLoading, error };
} 