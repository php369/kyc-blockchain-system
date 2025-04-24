'use client';

import { ethers } from 'ethers';
import { IPFS_GATEWAY_URL } from './constants';

/**
 * Upload a file to IPFS using web3.storage
 * @param {File} file - The file to upload
 * @param {Function} onProgress - Progress callback function
 * @returns {Promise<string>} The IPFS CID (Content Identifier)
 */
export async function uploadToIPFS(file, onProgress = () => {}) {
  // In a production environment, you would use a proper IPFS service
  // like web3.storage, Pinata, or Infura IPFS
  
  // This is a mock implementation that simulates uploading
  // In a real app, replace this with an actual API call
  
  return new Promise((resolve) => {
    let progress = 0;
    
    // Simulate upload progress
    const interval = setInterval(() => {
      progress += 10;
      onProgress(progress);
      
      if (progress >= 100) {
        clearInterval(interval);
        
        // Generate a mock IPFS hash
        const randomHash = ethers.utils.id(file.name + Date.now()).substring(2, 58);
        resolve(randomHash);
      }
    }, 300);
  });
}

/**
 * Get IPFS gateway URL for a given CID
 * @param {string} cid - The IPFS CID
 * @returns {string} The gateway URL
 */
export function getIPFSUrl(cid) {
  if (!cid) return '';
  return `${IPFS_GATEWAY_URL}${cid}`;
}

/**
 * Validate a file for upload
 * @param {File} file - The file to validate
 * @param {Object} options - Validation options
 * @returns {Object} Validation result
 */
export function validateFile(file, options = {}) {
  const {
    maxSizeMB = 5,
    allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png']
  } = options;
  
  const errors = [];
  
  // Check if file exists
  if (!file) {
    errors.push('No file selected');
    return { isValid: false, errors };
  }
  
  // Check file type
  if (!allowedTypes.includes(file.type)) {
    errors.push(`File type ${file.type} is not supported. Please upload a PDF, JPG, or PNG file.`);
  }
  
  // Check file size
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  if (file.size > maxSizeBytes) {
    errors.push(`File size exceeds the maximum limit of ${maxSizeMB}MB.`);
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Create a mock IPFS upload client
 * For testing and development purposes
 */
export function createMockIPFSClient() {
  return {
    put: async (files, options) => {
      const progress = options?.onProgress || (() => {});
      
      // Simulate upload delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Return a mock CID
      const randomCid = ethers.utils.id('mock-ipfs-' + Date.now()).substring(2, 58);
      return randomCid;
    },
    get: async (cid) => {
      // Simulate download delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Return mock data
      return new Blob(['Mock IPFS data for ' + cid], { type: 'text/plain' });
    }
  };
}