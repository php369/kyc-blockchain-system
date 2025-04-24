'use client';

import { useState } from 'react';
import { ROLES, ROLE_NAMES } from '../utils/constants';

export default function RoleSelect({ selectedRole, onChange }) {
  const [isOpen, setIsOpen] = useState(false);
  
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleRoleSelect = (role) => {
    onChange(role);
    setIsOpen(false);
  };

  // Admin is only creatable by another admin, not selectable during registration
  const availableRoles = [ROLES.CUSTOMER, ROLES.EMPLOYEE];

  return (
    <div className="relative inline-block text-left w-full">
      <div>
        <button
          type="button"
          className="inline-flex justify-between w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          id="role-menu-button"
          aria-expanded={isOpen}
          aria-haspopup="true"
          onClick={toggleDropdown}
        >
          {selectedRole ? ROLE_NAMES[selectedRole] : 'Select Role'}
          <svg className="-mr-1 ml-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      </div>

      {isOpen && (
        <div 
          className="origin-top-right absolute right-0 mt-2 w-full rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10"
          role="menu" 
          aria-orientation="vertical" 
          aria-labelledby="role-menu-button"
          tabIndex={-1}
        >
          <div className="py-1" role="none">
            {availableRoles.map((role) => (
              <button
                key={role}
                className={`
                  text-gray-700 block w-full text-left px-4 py-2 text-sm hover:bg-gray-100
                  ${selectedRole === role ? 'bg-gray-100 font-medium' : ''}
                `}
                role="menuitem"
                tabIndex={-1}
                onClick={() => handleRoleSelect(role)}
              >
                {ROLE_NAMES[role]}
              </button>
            ))}
          </div>
        </div>
      )}
      
      {/* Role Description */}
      <div className="mt-2">
        {selectedRole === ROLES.CUSTOMER && (
          <p className="text-sm text-gray-500">
            Register as a customer to submit and track your KYC verification.
          </p>
        )}
        {selectedRole === ROLES.EMPLOYEE && (
          <p className="text-sm text-gray-500">
            Register as a bank employee to review and verify customer KYC applications. Requires IFSC code and approval.
          </p>
        )}
      </div>
    </div>
  );
}