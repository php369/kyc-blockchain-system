'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import WalletConnectButton from '../../components/WalletConnectButton';
import { useWallet } from '../../context/WalletContext';
import { useContractContext } from '../../context/ContractContext';

export default function LoginPage() {
  const { isAuthenticated, isLoading, userRole, error } = useWallet();
  const { isLoading: isContractLoading, error: contractError, network } = useContractContext();
  const router = useRouter();
  const [isRedirecting, setIsRedirecting] = useState(false);
  
  useEffect(() => {
    if (isAuthenticated && !isLoading && !isContractLoading && !isRedirecting) {
      setIsRedirecting(true);
      
      // Redirect to appropriate dashboard based on role
      if (userRole === 1) { // Customer
        router.push('/dashboard/customer');
      } else if (userRole === 2) { // Employee
        router.push('/dashboard/employee');
      } else if (userRole === 3) { // Admin
        router.push('/dashboard/admin');
      }
    }
  }, [isAuthenticated, isLoading, isContractLoading, userRole, router, isRedirecting]);
  
  const displayError = error || contractError;
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
            Welcome to KYC-Nexus
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            Sign in with your blockchain wallet
          </p>
        </div>
        
        <div className="mt-8 space-y-6">
          <div className="bg-white dark:bg-gray-800 py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <div className="space-y-6">
              <div className="flex flex-col items-center justify-center space-y-4">
                <WalletConnectButton />
                
                {(isLoading || isContractLoading) && (
                  <div className="flex justify-center mt-4">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900 dark:border-white"></div>
                  </div>
                )}
                
                {displayError && (
                  <div className="mt-4 text-sm text-red-600 dark:text-red-400">
                    {displayError}
                  </div>
                )}
                
                {isRedirecting && (
                  <div className="mt-4 text-sm text-green-600 dark:text-green-400">
                    Redirecting to your dashboard...
                  </div>
                )}
              </div>
              
              <div className="text-sm text-center mt-6">
                <p className="text-gray-600 dark:text-gray-400">
                  Don&apos;t have an account?{' '}
                  <Link 
                    href="/register"
                    className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
                  >
                    Register now
                  </Link>
                </p>
              </div>
            </div>
          </div>
          
          <div className="text-center text-xs text-gray-500 dark:text-gray-400">
            <p>
              By signing in, you agree to our{' '}
              <Link href="/terms" className="underline">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link href="/privacy" className="underline">
                Privacy Policy
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}