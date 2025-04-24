'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ROLES } from '../../utils/constants';
import RoleSelect from '../../components/RoleSelect';
import CustomerRegistrationForm from '../../components/auth/CustomerRegistrationForm';
import EmployeeRegistrationForm from '../../components/auth/EmployeeRegistrationForm';

export default function RegisterPage() {
  const [selectedRole, setSelectedRole] = useState(null);
  
  const handleRoleChange = (role) => {
    setSelectedRole(role);
  };
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 mb-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
            Create your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            Register and connect your blockchain wallet
          </p>
        </div>
        
        <div className="mt-8 bg-white dark:bg-gray-800 py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Select your role
              </label>
              <RoleSelect selectedRole={selectedRole} onChange={handleRoleChange} />
            </div>
            
            <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
              {selectedRole === ROLES.CUSTOMER && (
                <CustomerRegistrationForm />
              )}
              
              {selectedRole === ROLES.EMPLOYEE && (
                <EmployeeRegistrationForm />
              )}
              
              {!selectedRole && (
                <p className="text-center text-sm text-gray-600 dark:text-gray-400">
                  Please select a role to continue registration
                </p>
              )}
            </div>
          </div>
        </div>
        
        <div className="text-center mt-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Already have an account?{' '}
            <Link 
              href="/login"
              className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}