'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useWallet } from '../../context/WalletContext';
import { useContractContext } from '../../context/ContractContext';
import { ERROR_MESSAGES } from '../../utils/constants';
import { useContractWrite } from '../../utils/contractHelpers';

export default function CustomerRegistrationForm() {
  const router = useRouter();
  const { address, isConnected } = useWallet();
  const { contract } = useContractContext();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    address: '',
    documentType: 'AADHAAR',
    documentNumber: '',
    pinCode: '',
    ifscCode: '',
    bankAccountNumber: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { execute: addCustomer, isLoading: isAddingCustomer } = useContractWrite('addCustomer');
  const { execute: submitKYC, isLoading: isSubmittingKYC } = useContractWrite('submitKYC');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = ERROR_MESSAGES.NAME_REQUIRED;
    if (!formData.email) newErrors.email = ERROR_MESSAGES.EMAIL_REQUIRED;
    if (!formData.phoneNumber) newErrors.phoneNumber = ERROR_MESSAGES.PHONE_REQUIRED;
    if (!formData.address) newErrors.address = ERROR_MESSAGES.ADDRESS_REQUIRED;
    if (!formData.documentNumber) newErrors.documentNumber = ERROR_MESSAGES.DOCUMENT_NUMBER_REQUIRED;
    if (!formData.pinCode) newErrors.pinCode = ERROR_MESSAGES.PIN_CODE_REQUIRED;
    if (!formData.ifscCode) newErrors.ifscCode = ERROR_MESSAGES.IFSC_REQUIRED;
    if (!formData.bankAccountNumber) newErrors.bankAccountNumber = ERROR_MESSAGES.BANK_ACCOUNT_REQUIRED;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      // First, add the customer to the contract
      const result = await addCustomer(address);
      if (result.error) {
        throw new Error(result.error);
      }

      // Then, submit KYC data
      const kycData = JSON.stringify({
        name: formData.name,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        address: formData.address,
        documentType: formData.documentType,
        documentNumber: formData.documentNumber,
        pinCode: formData.pinCode,
        bankAccountNumber: formData.bankAccountNumber
      });

      // For now, we'll use a placeholder IPFS hash
      const ipfsHash = "QmPlaceholderHash";

      const kycResult = await submitKYC(ipfsHash, formData.ifscCode);
      if (kycResult.error) {
        throw new Error(kycResult.error);
      }

      router.push('/dashboard/customer');
    } catch (error) {
      console.error('Registration error:', error);
      setErrors(prev => ({
        ...prev,
        submit: error.message || ERROR_MESSAGES.REGISTRATION_FAILED
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isConnected) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-lg">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Connect Your Wallet
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Please connect your wallet to register as a customer
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Customer Registration
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Please fill in your details to complete the registration
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="name" className="sr-only">Full Name</label>
              <input
                id="name"
                name="name"
                type="text"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Full Name"
                value={formData.name}
                onChange={handleChange}
              />
              {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
            </div>

            <div>
              <label htmlFor="email" className="sr-only">Email address</label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
                value={formData.email}
                onChange={handleChange}
              />
              {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
            </div>

            <div>
              <label htmlFor="phoneNumber" className="sr-only">Phone Number</label>
              <input
                id="phoneNumber"
                name="phoneNumber"
                type="text"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Phone Number"
                value={formData.phoneNumber}
                onChange={handleChange}
              />
              {errors.phoneNumber && <p className="mt-1 text-sm text-red-600">{errors.phoneNumber}</p>}
            </div>

            <div>
              <label htmlFor="address" className="sr-only">Address</label>
              <input
                id="address"
                name="address"
                type="text"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Address"
                value={formData.address}
                onChange={handleChange}
              />
              {errors.address && <p className="mt-1 text-sm text-red-600">{errors.address}</p>}
            </div>

            <div>
              <label htmlFor="documentType" className="sr-only">Document Type</label>
              <select
                id="documentType"
                name="documentType"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                value={formData.documentType}
                onChange={handleChange}
              >
                <option value="AADHAAR">AADHAAR</option>
                <option value="PAN">PAN</option>
                <option value="VOTER_ID">Voter ID</option>
                <option value="DRIVING_LICENSE">Driving License</option>
                <option value="PASSPORT">Passport</option>
              </select>
              {errors.documentType && <p className="mt-1 text-sm text-red-600">{errors.documentType}</p>}
            </div>

            <div>
              <label htmlFor="documentNumber" className="sr-only">Document Number</label>
              <input
                id="documentNumber"
                name="documentNumber"
                type="text"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Document Number"
                value={formData.documentNumber}
                onChange={handleChange}
              />
              {errors.documentNumber && <p className="mt-1 text-sm text-red-600">{errors.documentNumber}</p>}
            </div>

            <div>
              <label htmlFor="pinCode" className="sr-only">PIN Code</label>
              <input
                id="pinCode"
                name="pinCode"
                type="text"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="PIN Code"
                value={formData.pinCode}
                onChange={handleChange}
              />
              {errors.pinCode && <p className="mt-1 text-sm text-red-600">{errors.pinCode}</p>}
            </div>

            <div>
              <label htmlFor="ifscCode" className="sr-only">IFSC Code</label>
              <input
                id="ifscCode"
                name="ifscCode"
                type="text"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="IFSC Code"
                value={formData.ifscCode}
                onChange={handleChange}
              />
              {errors.ifscCode && <p className="mt-1 text-sm text-red-600">{errors.ifscCode}</p>}
            </div>

            <div>
              <label htmlFor="bankAccountNumber" className="sr-only">Bank Account Number</label>
              <input
                id="bankAccountNumber"
                name="bankAccountNumber"
                type="text"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Bank Account Number"
                value={formData.bankAccountNumber}
                onChange={handleChange}
              />
              {errors.bankAccountNumber && <p className="mt-1 text-sm text-red-600">{errors.bankAccountNumber}</p>}
            </div>
          </div>

          {errors.submit && (
            <div className="rounded-md bg-red-50 p-4">
              <div className="flex">
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">
                    {errors.submit}
                  </h3>
                </div>
              </div>
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={isSubmitting || isAddingCustomer || isSubmittingKYC}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {isSubmitting || isAddingCustomer || isSubmittingKYC ? 'Registering...' : 'Register'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}