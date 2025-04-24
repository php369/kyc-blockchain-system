'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useContract, useContractWrite, useStorageUpload } from '@thirdweb-dev/react';
import FormInput from '../FormInput';
import { CONTRACT_ADDRESS, ERROR_MESSAGES } from '../../utils/constants';
import { isValidIFSC } from '../../utils/regexValidators';
import { useWallet } from '../../context/WalletContext';

export default function KYCForm() {
  const router = useRouter();
  const { address, isCustomer } = useWallet();
  const { contract } = useContract(CONTRACT_ADDRESS);
  const { mutateAsync: uploadToIPFS } = useStorageUpload();
  
  const [formData, setFormData] = useState({
    ifscCode: '',
    aadhaarDocument: null
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  
  // Contract write hook
  const { mutateAsync: submitKYC } = useContractWrite(contract, "submitKYC");
  
  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    
    if (name === 'aadhaarDocument' && files && files.length > 0) {
      setFormData({
        ...formData,
        aadhaarDocument: files[0]
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };
  
  const validateForm = () => {
    const newErrors = {};
    
    // Basic validations
    if (!isValidIFSC(formData.ifscCode)) newErrors.ifscCode = ERROR_MESSAGES.IFSC_INVALID;
    if (!formData.aadhaarDocument) newErrors.aadhaarDocument = ERROR_MESSAGES.DOCUMENT_REQUIRED;
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!address || !isCustomer) {
      alert("You must be logged in as a customer to submit KYC");
      return;
    }
    
    if (!validateForm()) {
      return;
    }
    
    try {
      setIsSubmitting(true);
      setUploadProgress(10);
      
      // Upload document to IPFS
      const uploadResult = await uploadToIPFS({
        data: [formData.aadhaarDocument],
        onProgress: (progress) => {
          setUploadProgress(10 + Math.floor(progress * 0.7)); // 10-80% progress for upload
        }
      });
      
      setUploadProgress(80);
      
      // Get IPFS hash
      const ipfsHash = uploadResult[0];
      
      // Submit KYC to blockchain
      await submitKYC({ 
        args: [ipfsHash, formData.ifscCode] 
      });
      
      setUploadProgress(100);
      
      // Redirect to status page
      router.push('/kyc/status?submission=success');
    } catch (error) {
      console.error("KYC submission error:", error);
      setErrors({ 
        submit: "Failed to submit KYC. Please try again." 
      });
      setUploadProgress(0);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="bg-white shadow rounded-lg p-6 mb-8">
      <h2 className="text-xl font-semibold mb-6">Submit KYC Application</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <FormInput
          id="ifscCode"
          label="Bank IFSC Code"
          value={formData.ifscCode}
          onChange={handleInputChange}
          error={errors.ifscCode}
          placeholder="Enter bank IFSC code (e.g., SBIN0001234)"
          required
        />
        
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Upload Aadhaar Card <span className="text-red-500">*</span>
          </label>
          <input
            id="aadhaarDocument"
            name="aadhaarDocument"
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={handleInputChange}
            className="block w-full text-sm text-gray-500
                      file:mr-4 file:py-2 file:px-4
                      file:rounded-md file:border-0
                      file:text-sm file:font-semibold
                      file:bg-blue-50 file:text-blue-700
                      hover:file:bg-blue-100"
            required
          />
          {errors.aadhaarDocument && (
            <p className="text-red-600 text-sm">{errors.aadhaarDocument}</p>
          )}
          <p className="text-xs text-gray-500">
            Accepted file formats: PDF, JPG, JPEG, PNG (max 5MB)
          </p>
        </div>
        
        {errors.submit && (
          <div className="text-red-600 text-sm">
            {errors.submit}
          </div>
        )}
        
        {isSubmitting && uploadProgress > 0 && (
          <div className="mt-4">
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className="bg-blue-600 h-2.5 rounded-full transition-all duration-300" 
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-600 mt-1 text-center">
              {uploadProgress < 80 ? "Uploading document..." : 
               uploadProgress < 100 ? "Submitting to blockchain..." : 
               "Submission complete!"}
            </p>
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
                Submitting...
              </span>
            ) : (
              'Submit KYC'
            )}
          </button>
        </div>
        
        <p className="text-sm text-gray-600 mt-4">
          Note: Your KYC will be reviewed by a bank employee. Youll be notified once its approved or rejected.
        </p>
      </form>
    </div>
  );
}