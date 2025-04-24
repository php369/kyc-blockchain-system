'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { CONTRACT_ADDRESS, CONTRACT_ABI, BLOCKCHAIN_CONFIG } from '../utils/constants';

const ContractContext = createContext();

export function ContractProvider({ children }) {
  const [contract, setContract] = useState(null);
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [network, setNetwork] = useState(null);

  const initializeContract = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Check if MetaMask is installed
      if (!window.ethereum) {
        throw new Error('MetaMask is not installed');
      }

      // Initialize provider
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      setProvider(provider);

      // Get network
      const network = await provider.getNetwork();
      setNetwork(network);

      // Check if we're on the correct network
      if (network.chainId !== BLOCKCHAIN_CONFIG.chainId) {
        throw new Error(`Please switch to ${BLOCKCHAIN_CONFIG.chainName}`);
      }

      // Initialize contract
      const contract = new ethers.Contract(
        CONTRACT_ADDRESS,
        CONTRACT_ABI,
        provider
      );
      setContract(contract);

      // Request account access
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      
      // Create signer
      const signer = provider.getSigner();
      setSigner(signer);

      // Create contract with signer
      const contractWithSigner = contract.connect(signer);
      setContract(contractWithSigner);
    } catch (error) {
      console.error('Error initializing contract:', error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    initializeContract();

    // Listen for network changes
    if (window.ethereum) {
      window.ethereum.on('chainChanged', () => {
        window.location.reload();
      });

      window.ethereum.on('accountsChanged', () => {
        initializeContract();
      });
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeAllListeners('chainChanged');
        window.ethereum.removeAllListeners('accountsChanged');
      }
    };
  }, []);

  // Common contract read function
  const readContract = async (functionName, args = []) => {
    try {
      if (!contract) {
        throw new Error('Contract not initialized');
      }
      const result = await contract[functionName](...args);
      return { data: result, error: null };
    } catch (error) {
      console.error(`Error reading contract function ${functionName}:`, error);
      return { data: null, error: error.message };
    }
  };

  // Common contract write function
  const writeContract = async (functionName, args = []) => {
    try {
      if (!contract || !signer) {
        throw new Error('Contract or signer not initialized');
      }
      const tx = await contract[functionName](...args);
      const receipt = await tx.wait();
      return { result: receipt, error: null };
    } catch (error) {
      console.error(`Error writing to contract function ${functionName}:`, error);
      return { result: null, error: error.message };
    }
  };

  const value = {
    contract,
    provider,
    signer,
    error,
    isLoading,
    network,
    readContract,
    writeContract,
    initializeContract,
  };

  return <ContractContext.Provider value={value}>{children}</ContractContext.Provider>;
}

// Custom hook to use the contract context
export function useContractContext() {
  const context = useContext(ContractContext);
  if (context === undefined) {
    throw new Error('useContractContext must be used within a ContractProvider');
  }
  return context;
} 