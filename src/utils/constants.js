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
  export const CONTRACT_ADDRESS = "0xd2a5bC10698FD955D1Fe6cb468a17809A08fd005"; // Replace with your deployed contract address
  
  // Contract ABI
  export const CONTRACT_ABI =[
	{
		"inputs": [],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "user",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "newHash",
				"type": "string"
			}
		],
		"name": "IPFSUpdated",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "applicant",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "reason",
				"type": "string"
			}
		],
		"name": "KYCRejected",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "applicant",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "address",
				"name": "reverifiedBy",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "expiryDate",
				"type": "uint256"
			}
		],
		"name": "KYCReverified",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "applicant",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "ipfsHash",
				"type": "string"
			}
		],
		"name": "KYCSubmitted",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "applicant",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "address",
				"name": "verifiedBy",
				"type": "address"
			}
		],
		"name": "KYCVerified",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "user",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint8",
				"name": "role",
				"type": "uint8"
			}
		],
		"name": "UserAdded",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_user",
				"type": "address"
			}
		],
		"name": "addAdmin",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_user",
				"type": "address"
			},
			{
				"internalType": "string",
				"name": "_ifsc",
				"type": "string"
			}
		],
		"name": "addBankEmployee",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_user",
				"type": "address"
			}
		],
		"name": "addCustomer",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "admin",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_applicant",
				"type": "address"
			}
		],
		"name": "checkExpiry",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_ifsc",
				"type": "string"
			}
		],
		"name": "getIFSCEmployees",
		"outputs": [
			{
				"internalType": "address[]",
				"name": "",
				"type": "address[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_applicant",
				"type": "address"
			}
		],
		"name": "getKYCDetails",
		"outputs": [
			{
				"internalType": "enum DigitalKYC.KYCStatus",
				"name": "status",
				"type": "uint8"
			},
			{
				"internalType": "string",
				"name": "ipfsHash",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "expiry",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_userAddress",
				"type": "address"
			}
		],
		"name": "getUserRole",
		"outputs": [
			{
				"internalType": "uint8",
				"name": "",
				"type": "uint8"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "ifscEmployees",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "ipfsDocumentMap",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "kycExpiryDuration",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "kycRecords",
		"outputs": [
			{
				"internalType": "address",
				"name": "applicant",
				"type": "address"
			},
			{
				"internalType": "string",
				"name": "ipfsHash",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "ifscCode",
				"type": "string"
			},
			{
				"internalType": "enum DigitalKYC.KYCStatus",
				"name": "status",
				"type": "uint8"
			},
			{
				"internalType": "uint256",
				"name": "submissionDate",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "expiryDate",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "rejectionReason",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_applicant",
				"type": "address"
			},
			{
				"internalType": "string",
				"name": "_reason",
				"type": "string"
			}
		],
		"name": "rejectKYC",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_applicant",
				"type": "address"
			}
		],
		"name": "reverifyKYC",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_ipfsHash",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_ifscCode",
				"type": "string"
			}
		],
		"name": "submitKYC",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_newHash",
				"type": "string"
			}
		],
		"name": "updateIPFSHash",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "users",
		"outputs": [
			{
				"internalType": "uint8",
				"name": "role",
				"type": "uint8"
			},
			{
				"internalType": "string",
				"name": "ifscCode",
				"type": "string"
			},
			{
				"internalType": "bool",
				"name": "isActive",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_applicant",
				"type": "address"
			}
		],
		"name": "verifyKYC",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	}
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
    WALLET_ADDRESS: "Please enter a valid wallet address",
    NAME_REQUIRED: "Please enter your name",
    EMAIL_INVALID: "Please enter a valid email address",
    PHONE_INVALID: "Please enter a valid phone number",
    DOB_REQUIRED: "Please enter your date of birth",
    AADHAAR_INVALID: "Please enter your Aadhaar number",
    ADDRESS_REQUIRED: "Please enter your address",
    CITY_REQUIRED: "Please enter your city",
    STATE_REQUIRED: "Please enter your state",
    PIN_INVALID: "Please enter your PIN code",
    IFSC_INVALID: "Please enter your bank's IFSC code",
    BRANCH_REQUIRED: "Please enter your branch name",
    DOCUMENT_REQUIRED: "Please upload your document"
  };