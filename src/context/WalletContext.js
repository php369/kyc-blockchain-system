'use client';

import { createContext, useState, useEffect, useContext } from 'react';
import { useAddress, useDisconnect, useConnectionStatus, useContract, useContractRead } from '@thirdweb-dev/react';
import { CONTRACT_ADDRESS, ROLES } from '../utils/constants';

// Create context
const WalletContext = createContext();

export function WalletProvider({ children }) {
  const address = useAddress();
  const disconnect = useDisconnect();
  const connectionStatus = useConnectionStatus();
  const [userRole, setUserRole] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Get contract instance
  const { contract } = useContract(CONTRACT_ADDRESS);
  
  // Fetch user role when wallet is connected
  const { data: roleData, isLoading: roleLoading, error: roleError } = useContractRead(
    contract,
    "getUserRole",
    address ? [address] : undefined,
    {
      enabled: !!address && !!contract,
    }
  );
  
  useEffect(() => {
    if (!address) {
      setUserRole(null);
      setIsLoading(false);
      return;
    }
    
    if (roleData !== undefined) {
      // Convert BigNumber to number if needed
      const role = typeof roleData === 'object' && roleData._isBigNumber 
        ? roleData.toNumber() 
        : Number(roleData);
        
      setUserRole(role);
      setIsLoading(false);
    } else if (roleError) {
      console.error("Error fetching user role:", roleError);
      setError("Failed to fetch user role. Please try again.");
      setIsLoading(false);
    }
  }, [address, roleData, roleError]);
  
  const isAuthenticated = !!address && userRole !== null && userRole > 0;
  
  const isCustomer = isAuthenticated && userRole === ROLES.CUSTOMER;
  const isEmployee = isAuthenticated && userRole === ROLES.EMPLOYEE;
  const isAdmin = isAuthenticated && userRole === ROLES.ADMIN;
  
  const logoutWallet = () => {
    disconnect();
    setUserRole(null);
  };
  
  const value = {
    address,
    connectionStatus,
    userRole,
    isLoading,
    error,
    isAuthenticated,
    isCustomer,
    isEmployee,
    isAdmin,
    logoutWallet,
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