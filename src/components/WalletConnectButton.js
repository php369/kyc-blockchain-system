'use client';

import { useState } from 'react';
import { useWallet } from '../context/WalletContext';

export default function WalletConnectButton() {
  const { address, isConnected, connectWallet, disconnectWallet } = useWallet();
  const [showAddress, setShowAddress] = useState(false);

  const formatAddress = (addr) => {
    if (!addr) return "";
    return `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`;
  };

  const handleDisconnect = () => {
    disconnectWallet();
    setShowAddress(false);
  };

  const handleToggleAddress = () => {
    setShowAddress(!showAddress);
  };

  return (
    <div className="flex flex-col items-center">
      {isConnected ? (
        <div className="flex flex-col items-center gap-2">
          <div className="px-4 py-2 rounded-md flex items-center gap-2 bg-green-600">
            <div className="w-2 h-2 rounded-full bg-white animate-pulse"></div>
            <button 
              onClick={handleToggleAddress}
              className="text-white font-medium"
            >
              {showAddress ? address : formatAddress(address)}
            </button>
          </div>
          
          <button 
            onClick={handleDisconnect}
            className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
          >
            Disconnect
          </button>
        </div>
      ) : (
        <button
          onClick={connectWallet}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
        >
          Connect Wallet
        </button>
      )}
    </div>
  );
}