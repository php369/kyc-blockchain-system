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
      if (!contract || !readContract) {
        console.log('Contract not initialized yet');
        return false;
      }

      // Check if the contract is properly initialized
      if (!contract.address || !readContract.address) {
        console.log('Contract address not set');
        return false;
      }

      const { data: role, error } = await readContract('getUserRole', [userAddress]);
      
      if (error) {
        console.error('Error reading user role:', error);
        return false;
      }

      // Handle the case where role is undefined or null
      if (role === undefined || role === null) {
        console.log('No role found for user');
        setUserRole(null);
        return false;
      }

      // Convert role to number and check if it's valid
      const roleNumber = Number(role);
      if (roleNumber > 0) {
        setUserRole(roleNumber);
        return true;
      }
      
      setUserRole(null);
      return false;
    } catch (error) {
      console.error('Error verifying user role:', error);
      setUserRole(null);
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
            
            // Only verify role if contract is initialized
            if (contract && readContract && contract.address && readContract.address) {
              await verifyUserRole(userAddress);
            }
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
          
          // Only verify role if contract is initialized
          if (contract && readContract && contract.address && readContract.address) {
            await verifyUserRole(userAddress);
          }
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
  }, [contract, readContract]);

  const connectWallet = async () => {
    try {
      if (!window.ethereum) {
        throw new Error('MetaMask is not installed');
      }

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send('eth_requestAccounts', []);
      const signer = provider.getSigner();
      const userAddress = await signer.getAddress();

      setAddress(userAddress);
      setIsConnected(true);

      // Only verify role if contract is initialized
      if (contract && readContract && contract.address && readContract.address) {
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
    setError(null);
  };

  const value = {
    address,
    userRole,
    isLoading,
    error,
    isConnected,
    connectWallet,
    disconnectWallet,
    isAdmin: userRole === ROLES.ADMIN,
    isEmployee: userRole === ROLES.EMPLOYEE,
    isCustomer: userRole === ROLES.CUSTOMER
  };

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
}