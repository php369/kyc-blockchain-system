'use client';

import { useState, useEffect } from 'react';
import { ConnectWallet, useAddress, useConnectionStatus, useDisconnect } from "@thirdweb-dev/react";
import { isValidWalletAddress } from '../utils/regexValidators';

export default function WalletConnectButton() {
  const address = useAddress();
  const connectionStatus = useConnectionStatus();
  const disconnect = useDisconnect();
  const [walletAddress, setWalletAddress] = useState("");
  const [isValid, setIsValid] = useState(true);
  const [showAddress, setShowAddress] = useState(false);

  useEffect(() => {
    if (address) {
      setWalletAddress(address);
      setIsValid(isValidWalletAddress(address));
    } else {
      setWalletAddress("");
      setIsValid(true);
    }
  }, [address]);

  const formatAddress = (addr) => {
    if (!addr) return "";
    return `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`;
  };

  const handleDisconnect = () => {
    disconnect();
    setWalletAddress("");
    setIsValid(true);
    setShowAddress(false);
  };

  const handleToggleAddress = () => {
    setShowAddress(!showAddress);
  };

  return (
    <div className="flex flex-col items-center">
      {connectionStatus === "connected" ? (
        <div className="flex flex-col items-center gap-2">
          <div className={`px-4 py-2 rounded-md flex items-center gap-2 ${isValid ? 'bg-green-600' : 'bg-red-600'}`}>
            <div className="w-2 h-2 rounded-full bg-white animate-pulse"></div>
            <button 
              onClick={handleToggleAddress}
              className="text-white font-medium"
            >
              {showAddress ? walletAddress : formatAddress(walletAddress)}
            </button>
          </div>
          
          {!isValid && (
            <p className="text-red-500 text-xs">Invalid wallet format</p>
          )}
          
          <button 
            onClick={handleDisconnect}
            className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
          >
            Disconnect
          </button>
        </div>
      ) : (
        <ConnectWallet 
          theme="dark"
          btnTitle="Connect Wallet"
          modalTitle="Connect to MetaMask"
          modalSize="wide"
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
        />
      )}
    </div>
  );
}