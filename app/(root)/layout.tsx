'use client';
import { ReactNode, useEffect } from "react"
import {
  PushUniversalWalletProvider,
  PushUniversalAccountButton,
  usePushWalletContext,
  PushUI,
  usePushChainClient
} from '@pushchain/ui-kit';
import { Home, ShoppingCart, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getUserProfile, saveUserProfile } from "@/lib/utils/user-api";
import { Toaster } from "sonner";
import { redirect } from "next/navigation";

const layout = ({ children }: { children: ReactNode }) => {

  const { connectionStatus } = usePushWalletContext();
  const { pushChainClient, isInitialized, error } = usePushChainClient();
  const registringWallet = async () => {
    try {
      if (!pushChainClient?.universal.origin.address) return;
      console.log('Connection Status:', pushChainClient?.universal.origin.address, connectionStatus, isInitialized, error);
      const getUserRes = await getUserProfile(pushChainClient?.universal.origin.address as string);
      if (getUserRes) {
        console.log('User profile already exists:', getUserRes);
        return;
      }
      const res = await saveUserProfile({ walletAddress: pushChainClient?.universal.origin.address as string });
      console.log('User profile saved successfully:', res);
    } catch (err) {
      console.error('Error in saving user profile:', err);
    }
  }
  useEffect(() => {
    registringWallet();
  }, [connectionStatus, isInitialized, error, pushChainClient])


  return (

    <div className="min-h-screen">
      <NavBar />
      <Toaster />
      <div>{children}</div>
      <Footer />
    </div>
  )
}
export default layout


const NavBar = () => (
  <nav className="border-b sticky top-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50">
    <div className="container mx-auto px-4 py-4 flex items-center justify-between">
      <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.location.href = '/'}>
        <div className="w-10 h-10 bg-primary flex items-center justify-center">
          <ShoppingCart className="w-6 h-6 text-primary-foreground" />
        </div>
        <span className="text-2xl font-bold">CryptoCart</span>
      </div>

      <div className="hidden md:flex items-center gap-6">
        <Button variant="ghost">Features</Button>
        <Button variant="ghost">How It Works</Button>
        <Button variant="ghost">Pricing</Button>
        <Button variant="ghost">About</Button>
      </div>

      <div className="flex items-center gap-4">
        {/* <Button variant="ghost">Sign In</Button>
        <Button onClick={handleStartShopping}>
          <Wallet className="w-4 h-4 mr-2" />
          Connect Wallet
        </Button> */}
        <PushUniversalAccountButton/>
      </div>
    </div>
  </nav>

);

const Footer = () => (
  <footer className="border-t mt-20">
    <div className="container mx-auto px-4 py-12">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-primary flex items-center justify-center">
              <span className="text-xl font-bold text-primary-foreground">$</span>
            </div>
            <span className="text-xl font-bold">UNI CART</span>
          </div>
          <p className="text-sm text-muted-foreground">No KYC, fully compliant.</p>
        </div>

        <div>
          <h3 className="font-semibold mb-4">Links</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>What is UNI CART?</li>
            <li>Profile & Points</li>
            <li>UNI CART Network</li>
          </ul>
        </div>

        <div>
          <h3 className="font-semibold mb-4">Legal</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>Terms & Conditions</li>
            <li>Privacy Policy</li>
            <li>Cookie Policy</li>
          </ul>
        </div>

        <div>
          <h3 className="font-semibold mb-4">Connect</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>Contact Us</li>
            <li>FAQ</li>
            <li>Support</li>
          </ul>
        </div>
      </div>
    </div>
  </footer>
);