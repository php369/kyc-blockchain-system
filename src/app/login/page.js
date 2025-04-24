'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useWallet } from '../../context/WalletContext';
import { useContractContext } from '../../context/ContractContext';
import { ROLES, ROLE_NAMES } from '../../utils/constants';
import WalletConnectButton from '../../components/WalletConnectButton';
import useContractStore from '../../store/contractStore';

export default function LoginPage() {
  const router = useRouter();
  const { address, isConnected, isLoading: isWalletLoading, error: walletError } = useWallet();
  const { isLoading: isContractLoading, error: contractError } = useContractContext();
  const { 
    userRole, 
    isLoading: isRoleLoading, 
    error: roleError, 
    roleCheckStatus,
    getUserRole 
  } = useContractStore();

  useEffect(() => {
    const handleRoleCheck = async () => {
      if (!isConnected || !address || isContractLoading) {
        return;
      }

      const role = await getUserRole(address);
      console.log('User role:', role);
      if (role) {
        switch (role) {
          case ROLES.CUSTOMER:
            router.push('/dashboard/customer');
            break;
          case ROLES.BANK_EMPLOYEE:
            router.push('/dashboard/employee');
            break;
          case ROLES.ADMIN:
            router.push('/dashboard/admin');
            break;
        }
      }
    };

    handleRoleCheck();
  }, [isConnected, address, isContractLoading, getUserRole, router]);

  const displayError = walletError || contractError || roleError;
  const isLoading = isWalletLoading || isContractLoading || isRoleLoading;

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
                
                {isLoading && (
                  <div className="flex flex-col items-center space-y-2 mt-4">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900 dark:border-white"></div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {isWalletLoading ? 'Connecting wallet...' : 
                       isContractLoading ? 'Initializing contract...' : 
                       'Checking your role...'}
                    </p>
                  </div>
                )}

                {isConnected && !isLoading && (
                  <div className="mt-4 text-center">
                    {roleCheckStatus && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                        {roleCheckStatus}
                      </p>
                    )}
                    
                    {userRole ? (
                      <div className="mt-4">
                        <Link
                          href={`/dashboard/${ROLE_NAMES[userRole].toLowerCase().replace(' ', '-')}`}
                          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                          Go to Dashboard
                        </Link>
                      </div>
                    ) : (
                      <div className="mt-4">
                        <Link
                          href="/register"
                          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                        >
                          Register Now
                        </Link>
                      </div>
                    )}
                  </div>
                )}

                {displayError && (
                  <div className="mt-4 text-sm text-red-600 dark:text-red-400">
                    {displayError}
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