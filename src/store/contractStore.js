import { create } from 'zustand';
import { useWallet } from '../context/WalletContext';
import { useContractContext } from '../context/ContractContext';
import { ROLES } from '../utils/constants';

const useContractStore = create((set, get) => ({
  // State
  userRole: null,
  isLoading: false,
  error: null,
  roleCheckStatus: '',

  // Actions
  getUserRole: async (address) => {
    const { readContract } = useContractContext.getState();
    
    if (!address) {
      set({ error: 'No address provided', roleCheckStatus: 'Please connect your wallet' });
      return null;
    }

    if (!readContract) {
      set({ error: 'Contract not initialized', roleCheckStatus: 'Waiting for contract initialization...' });
      return null;
    }

    try {
      set({ 
        isLoading: true, 
        error: null,
        roleCheckStatus: 'Checking user role...'
      });
      
      const role = await readContract.getUserRole(address);
      
      if (role === 0) {
        set({ 
          userRole: null,
          roleCheckStatus: 'No role found. Please register to continue.'
        });
      } else {
        set({ 
          userRole: role,
          roleCheckStatus: `Role found: ${ROLES[role]}`
        });
      }
      
      return role;
    } catch (err) {
      console.error('Error getting user role:', err);
      let errorMessage = 'Failed to get user role';
      
      if (err.message.includes('execution reverted')) {
        errorMessage = 'Contract execution failed. Please try again.';
      } else if (err.message.includes('network error')) {
        errorMessage = 'Network error. Please check your connection.';
      } else if (err.message.includes('user denied')) {
        errorMessage = 'Transaction was rejected by user.';
      }
      
      set({ 
        error: errorMessage,
        roleCheckStatus: errorMessage
      });
      return null;
    } finally {
      set({ isLoading: false });
    }
  },

  checkUserRole: async () => {
    const { address, isConnected } = useWallet.getState();
    
    if (!isConnected) {
      set({ 
        error: 'Wallet not connected',
        roleCheckStatus: 'Please connect your wallet first'
      });
      return null;
    }

    if (!address) {
      set({ 
        error: 'No address found',
        roleCheckStatus: 'Please connect your wallet'
      });
      return null;
    }

    return get().getUserRole(address);
  },

  addCustomer: async (address) => {
    const { contract } = useContractContext.getState();
    if (!contract) {
      set({ error: 'Contract not initialized' });
      return false;
    }

    try {
      set({ isLoading: true, error: null });
      const tx = await contract.addCustomer(address);
      await tx.wait();
      return true;
    } catch (err) {
      console.error('Error adding customer:', err);
      set({ error: 'Failed to add customer' });
      return false;
    } finally {
      set({ isLoading: false });
    }
  },

  addBankEmployee: async (address, ifscCode) => {
    const { contract } = useContractContext.getState();
    if (!contract) {
      set({ error: 'Contract not initialized' });
      return false;
    }

    try {
      set({ isLoading: true, error: null });
      const tx = await contract.addBankEmployee(address, ifscCode);
      await tx.wait();
      return true;
    } catch (err) {
      console.error('Error adding bank employee:', err);
      set({ error: 'Failed to add bank employee' });
      return false;
    } finally {
      set({ isLoading: false });
    }
  },

  submitKYC: async (ipfsHash, ifscCode) => {
    const { contract } = useContractContext.getState();
    if (!contract) {
      set({ error: 'Contract not initialized' });
      return false;
    }

    try {
      set({ isLoading: true, error: null });
      const tx = await contract.submitKYC(ipfsHash, ifscCode);
      await tx.wait();
      return true;
    } catch (err) {
      console.error('Error submitting KYC:', err);
      set({ error: 'Failed to submit KYC' });
      return false;
    } finally {
      set({ isLoading: false });
    }
  },

  // Helper functions
  isAdmin: () => get().userRole === ROLES.ADMIN,
  isEmployee: () => get().userRole === ROLES.BANK_EMPLOYEE,
  isCustomer: () => get().userRole === ROLES.CUSTOMER,
  hasRole: () => get().userRole !== null,

  // Reset state
  reset: () => set({ 
    userRole: null, 
    isLoading: false, 
    error: null,
    roleCheckStatus: ''
  }),
}));

export default useContractStore; 