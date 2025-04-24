'use client';

import { createContext, useState, useEffect, useContext } from 'react';
import { ethers } from 'ethers';
import { ROLES } from '../utils/constants';
import { useContractContext } from './ContractContext';

const WalletContext = createContext();

export function WalletProvider({ children }) {
  const [address, setAddress] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const { contract, readContract, error: contractError } = useContractContext();

  const verifyUserRole = async (userAddress) => {
    try {
      if (!contract) {
        throw new Error('Contract not initialized');
      }

      const { data: role, error } = await readContract('getUserRole', [userAddress]);
      
      if (error) {
        throw new Error(error);
      }

      if (role && role > 0) {
        setUserRole(Number(role));
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error verifying user role:', error);
      setError(error.message);
      return false;
    }
  };

  useEffect(() => {
    const checkConnection = async () => {
      if (window.ethereum) {
        try {
          const provider = new ethers.providers.Web3Provider(window.ethereum);
          const accounts = await provider.listAccounts();
          
          if (accounts.length > 0) {
            const userAddress = accounts[0];
            setAddress(userAddress);
            setIsConnected(true);
            
            // Verify user role
            await verifyUserRole(userAddress);
          }
        } catch (error) {
          console.error('Error checking connection:', error);
          setError(error.message);
        }
      }
      setIsLoading(false);
    };

    checkConnection();

    // Listen for account changes
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', async (accounts) => {
        if (accounts.length > 0) {
          const userAddress = accounts[0];
          setAddress(userAddress);
          setIsConnected(true);
          
          // Verify user role
          await verifyUserRole(userAddress);
        } else {
          setAddress(null);
          setIsConnected(false);
          setUserRole(null);
        }
      });

      window.ethereum.on('chainChanged', () => {
        window.location.reload();
      });
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeAllListeners('accountsChanged');
        window.ethereum.removeAllListeners('chainChanged');
      }
    };
  }, [contract]);

  const connectWallet = async () => {
    try {
      if (!window.ethereum) {
        throw new Error('MetaMask is not installed');
      }

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const accounts = await provider.send('eth_requestAccounts', []);
      
      if (accounts.length > 0) {
        const userAddress = accounts[0];
        setAddress(userAddress);
        setIsConnected(true);
        
        // Verify user role
        await verifyUserRole(userAddress);
      }
    } catch (error) {
      console.error('Error connecting wallet:', error);
      setError(error.message);
    }
  };

  const disconnectWallet = () => {
    setAddress(null);
    setIsConnected(false);
    setUserRole(null);
  };

  const isAuthenticated = isConnected && userRole !== null && userRole > 0;
  const isCustomer = isAuthenticated && userRole === ROLES.CUSTOMER;
  const isEmployee = isAuthenticated && userRole === ROLES.EMPLOYEE;
  const isAdmin = isAuthenticated && userRole === ROLES.ADMIN;

  const value = {
    address,
    isConnected,
    userRole,
    isLoading,
    error: error || contractError,
    isAuthenticated,
    isCustomer,
    isEmployee,
    isAdmin,
    connectWallet,
    disconnectWallet,
  };

  return <WalletContext.Provider value={value}>{children}</WalletContext.Provider>;
}

// Custom hook to use the wallet context
export function useWallet() {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
}