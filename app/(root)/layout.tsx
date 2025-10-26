'use client';
import { ReactNode } from "react"


import {  Home, User} from 'lucide-react';
import { Button } from '@/components/ui/button';

const layout = ({children}:{children:ReactNode}) => {
      const NavBar = () => (
        <nav className="border-b">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary flex items-center justify-center">
                <span className="text-xl font-bold text-primary-foreground">$</span>
              </div>
              <span className="text-2xl font-bold">SP3ND</span>
            </div>
            
            <div className="flex items-center gap-6">
              <Button variant="ghost">
                <Home className="w-4 h-4 mr-2" />
                Home
              </Button>
              <Button variant="ghost">
                <User className="w-4 h-4 mr-2" />
              </Button>
              <Button>
                9HKE...B5ei
                <span className="ml-2">✓ Active</span>
              </Button>
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
                  <span className="text-xl font-bold">SP3ND</span>
                </div>
                <p className="text-sm text-muted-foreground">No KYC, fully compliant.</p>
              </div>
              
              <div>
                <h3 className="font-semibold mb-4">Links</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>What is SP3ND?</li>
                  <li>Profile & Points</li>
                  <li>SP3ND Network</li>
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
    
  return (

        <div className="min-h-screen">
      <NavBar />
    <div>{children}</div>
      <Footer />
    </div>
  )
}
export default layout