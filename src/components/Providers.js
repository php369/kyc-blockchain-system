'use client';

import { ContractProvider } from '../context/ContractContext';
import { WalletProvider } from '../context/WalletContext';

export default function Providers({ children }) {
  return (
    <ContractProvider>
      <WalletProvider>
        {children}
      </WalletProvider>
    </ContractProvider>
  );
}