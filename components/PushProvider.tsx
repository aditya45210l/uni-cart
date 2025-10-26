'use client';
import {
  PushUniversalWalletProvider,
  PushUniversalAccountButton,
  PushUI,
} from '@pushchain/ui-kit';
import { ReactNode } from 'react';
export const PushProvider = ({children}:{children:ReactNode}) => {
      const walletConfig = {
    network: PushUI.CONSTANTS.PUSH_NETWORK.TESTNET,
  };
  return (
    <PushUniversalWalletProvider config={walletConfig}>
      {/* <PushUniversalAccountButton />
       */}
       {children}
    </PushUniversalWalletProvider>
  
  )
}