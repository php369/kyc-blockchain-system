// Role definitions from the smart contract
// 1 = Customer, 2 = BankEmployee, 3 = Admin
export const ROLES = {
    CUSTOMER: 1,
    EMPLOYEE: 2,
    ADMIN: 3
  };
  
  export const ROLE_NAMES = {
    1: "Customer",
    2: "Bank Employee",
    3: "Admin"
  };
  
  // KYC Status from the smart contract
  // KYCStatus enum: Pending, VerifiedByEmployee, ReverifiedByAdmin, Rejected, Expired
  export const KYC_STATUS = {
    PENDING: 0,
    VERIFIED_BY_EMPLOYEE: 1,
    REVERIFIED_BY_ADMIN: 2,
    REJECTED: 3,
    EXPIRED: 4
  };
  
  export const KYC_STATUS_NAMES = {
    0: "Pending Review",
    1: "Verified by Employee",
    2: "Verified by Admin",
    3: "Rejected",
    4: "Expired"
  };
  
  export const KYC_STATUS_COLORS = {
    0: "bg-gray-500",
    1: "bg-blue-500",
    2: "bg-yellow-500",
    3: "bg-red-500",
    4: "bg-green-500",
    5: "bg-orange-500"
  };
  
  // Contract information for Sepolia testnet
  export const CONTRACT_ADDRESS = "0xB90f80C1d23014418eeFcE5CDB41EBBd356aA5f4"; // Replace with your deployed contract address
  
  // Contract ABI
  export const CONTRACT_ABI = [
    // Add your contract ABI here
    // Example:
    {
      "inputs": [],
      "name": "getUserRole",
      "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
      "stateMutability": "view",
      "type": "function"
    },
    // Add other contract functions here
  ];
  
  // IPFS gateway URL for retrieving documents
  export const IPFS_GATEWAY_URL = "https://gateway.ipfscdn.io/ipfs/";
  
  // Blockchain Network Information
  export const BLOCKCHAIN_CONFIG = {
    chainId: 11155111, // Sepolia testnet
    chainName: "Sepolia",
    nativeCurrency: {
      name: "Sepolia ETH",
      symbol: "ETH",
      decimals: 18
    },
    rpcUrls: ["https://sepolia.infura.io/v3/"],
    blockExplorerUrls: ["https://sepolia.etherscan.io"]
  };
  
  // Dashboard navigation items based on role
  export const DASHBOARD_NAV_ITEMS = {
    [ROLES.CUSTOMER]: [
      { name: "Dashboard", href: "/dashboard/customer", icon: "Home" },
      { name: "Submit KYC", href: "/kyc/submit", icon: "FileUp" },
      { name: "KYC Status", href: "/kyc/status", icon: "FileCheck" },
      { name: "Profile", href: "/profile", icon: "User" }
    ],
    [ROLES.EMPLOYEE]: [
      { name: "Dashboard", href: "/dashboard/employee", icon: "Home" },
      { name: "Pending Applications", href: "/dashboard/employee/pending", icon: "Clock" },
      { name: "Verified KYCs", href: "/dashboard/employee/verified", icon: "Shield" },
      { name: "Profile", href: "/profile", icon: "User" }
    ],
    [ROLES.ADMIN]: [
      { name: "Dashboard", href: "/dashboard/admin", icon: "Home" },
      { name: "KYC Approvals", href: "/dashboard/admin/approvals", icon: "CheckCircle" },
      { name: "Bank Management", href: "/admin/banks", icon: "Building" },
      { name: "User Management", href: "/admin/users", icon: "Users" },
      { name: "System Stats", href: "/admin/stats", icon: "BarChart" }
    ]
  };
  
  // Form validation error messages
  export const ERROR_MESSAGES = {
    WALLET_ADDRESS: "Invalid wallet address format",
    NAME_REQUIRED: "Name is required",
    EMAIL_INVALID: "Invalid email address",
    PHONE_INVALID: "Invalid Indian phone number",
    DOB_REQUIRED: "Date of birth is required",
    AADHAAR_INVALID: "Invalid Aadhaar number",
    ADDRESS_REQUIRED: "Address Line 1 is required",
    CITY_REQUIRED: "City is required",
    STATE_REQUIRED: "State is required",
    PIN_INVALID: "Invalid PIN code",
    IFSC_INVALID: "Invalid IFSC code",
    BRANCH_REQUIRED: "Branch name is required",
    DOCUMENT_REQUIRED: "Document is required"
  };