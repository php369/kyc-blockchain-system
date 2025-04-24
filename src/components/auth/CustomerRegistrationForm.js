'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useWallet, useContractContext } from '../../context';
import FormInput from '../FormInput';
import WalletConnectButton from '../WalletConnectButton';
import { ERROR_MESSAGES } from '../../utils/constants';
import { isValidEmail, isValidIndianPhone, isValidAadhaar, isValidPinCode } from '../../utils/regexValidators';

export default function CustomerRegistrationForm() {
  const router = useRouter();
  const { address, isConnected } = useWallet();
  const { writeContract } = useContractContext();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    aadhaarNumber: '',
    addressLine1: '',
    city: '',
    state: '',
    pinCode: ''
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };
  
  const validateForm = () => {
    const newErrors = {};
    
    // Basic validations
    if (!formData.name.trim()) newErrors.name = ERROR_MESSAGES.NAME_REQUIRED;
    if (!isValidEmail(formData.email)) newErrors.email = ERROR_MESSAGES.EMAIL_INVALID;
    if (!isValidIndianPhone(formData.phone)) newErrors.phone = ERROR_MESSAGES.PHONE_INVALID;
    if (!formData.dateOfBirth) newErrors.dateOfBirth = ERROR_MESSAGES.DOB_REQUIRED;
    if (!isValidAadhaar(formData.aadhaarNumber)) newErrors.aadhaarNumber = ERROR_MESSAGES.AADHAAR_INVALID;
    if (!formData.addressLine1.trim()) newErrors.addressLine1 = ERROR_MESSAGES.ADDRESS_REQUIRED;
    if (!formData.city.trim()) newErrors.city = ERROR_MESSAGES.CITY_REQUIRED;
    if (!formData.state.trim()) newErrors.state = ERROR_MESSAGES.STATE_REQUIRED;
    if (!isValidPinCode(formData.pinCode)) newErrors.pinCode = ERROR_MESSAGES.PIN_INVALID;
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!isConnected) {
      alert("Please connect your wallet first");
      return;
    }
    
    if (!validateForm()) {
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      // Call contract to register customer
      const { result, error } = await writeContract('addCustomer', [address]);
      
      if (error) {
        throw new Error(error);
      }
      
      // Redirect to login page after successful registration
      router.push('/login?registration=success');
    } catch (error) {
      console.error("Registration error:", error);
      setErrors({ 
        submit: "Failed to register. Please try again." 
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
        <h2 className="text-center text-2xl font-bold mb-6">Customer Registration</h2>
        
        <div className="mb-6">
          <p className="text-sm text-gray-600 mb-4">First, connect your wallet:</p>
          <div className="flex justify-center">
            <WalletConnectButton />
          </div>
        </div>
        
        {isConnected ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            <FormInput
              id="name"
              label="Full Name"
              value={formData.name}
              onChange={handleInputChange}
              error={errors.name}
              required
            />
            
            <FormInput
              id="email"
              label="Email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              error={errors.email}
              required
            />
            
            <FormInput
              id="phone"
              label="Phone Number"
              value={formData.phone}
              onChange={handleInputChange}
              error={errors.phone}
              placeholder="10-digit mobile number"
              required
            />
            
            <FormInput
              id="dateOfBirth"
              label="Date of Birth"
              type="date"
              value={formData.dateOfBirth}
              onChange={handleInputChange}
              error={errors.dateOfBirth}
              required
            />
            
            <FormInput
              id="aadhaarNumber"
              label="Aadhaar Number"
              value={formData.aadhaarNumber}
              onChange={handleInputChange}
              error={errors.aadhaarNumber}
              placeholder="12-digit Aadhaar number"
              required
            />
            
            <FormInput
              id="addressLine1"
              label="Address Line 1"
              value={formData.addressLine1}
              onChange={handleInputChange}
              error={errors.addressLine1}
              required
            />
            
            <div className="grid grid-cols-2 gap-4">
              <FormInput
                id="city"
                label="City"
                value={formData.city}
                onChange={handleInputChange}
                error={errors.city}
                required
              />
              
              <FormInput
                id="state"
                label="State"
                value={formData.state}
                onChange={handleInputChange}
                error={errors.state}
                required
              />
            </div>
            
            <FormInput
              id="pinCode"
              label="PIN Code"
              value={formData.pinCode}
              onChange={handleInputChange}
              error={errors.pinCode}
              placeholder="6-digit PIN code"
              required
            />
            
            {errors.submit && (
              <div className="text-red-600 text-sm mt-2">
                {errors.submit}
              </div>
            )}
            
            <div>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 ${
                  isSubmitting ? 'opacity-75 cursor-not-allowed' : 'hover:bg-blue-700'
                }`}
              >
                {isSubmitting ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Registering...
                  </span>
                ) : (
                  'Register'
                )}
              </button>
            </div>
          </form>
        ) : (
          <p className="text-center text-sm text-gray-600">
            Please connect your wallet to register.
          </p>
        )}
      </div>
    </div>
  );
}