'use client';
import React, { useState } from 'react';
import { ShoppingCart, Zap, Shield, Globe, Wallet, ArrowRight, Check, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { redirect } from 'next/navigation';
import { PushUniversalAccountButton } from '@pushchain/ui-kit';

const CryptoCartLanding = () => {
  const [activeTab, setActiveTab] = useState('features');

  const handleStartShopping = () => {
    window.location.href = '/cart';
  };

  return (
    <div className="min-h-screen">
      {/* Navigation */}
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

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <Badge className="mb-6">
          <Zap className="w-3 h-3 mr-1" />
          Powered by Push Chain
        </Badge>
        
        <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight">
          Shop Amazon with
          <span className="block mt-2 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Cryptocurrency
          </span>
        </h1>
        
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
          The easiest way to spend your crypto on millions of products. No KYC required. 
          Instant checkout. Global shipping.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Button size="lg" className="text-lg px-8 py-6" onClick={() => redirect('/cart')}>
            Start Shopping
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
          <Button size="lg" variant="outline" className="text-lg px-8 py-6">
            Watch Demo
          </Button>
        </div>

        <div className="flex flex-wrap justify-center gap-8 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-primary" />
            <span>No KYC Required</span>
          </div>
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-primary" />
            <span>Instant Processing</span>
          </div>
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-primary" />
            <span>Global Shipping</span>
          </div>
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-primary" />
            <span>Secure Payments</span>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="border-y bg-muted/50">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">500M+</div>
              <div className="text-sm text-muted-foreground">Products Available</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">195+</div>
              <div className="text-sm text-muted-foreground">Countries Supported</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">$10M+</div>
              <div className="text-sm text-muted-foreground">Volume Processed</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">50K+</div>
              <div className="text-sm text-muted-foreground">Happy Customers</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <Badge className="mb-4">Features</Badge>
          <h2 className="text-4xl font-bold mb-4">Why Choose CryptoCart?</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Shop smarter with crypto. Experience the future of e-commerce today.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <Card>
            <CardHeader>
              <div className="w-12 h-12 bg-primary/10 flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-primary" />
              </div>
              <CardTitle>Lightning Fast</CardTitle>
              <CardDescription>
                Instant checkout powered by Push Chain. No more waiting for payment confirmations.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-primary mt-0.5" />
                  <span>Sub-second transaction finality</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-primary mt-0.5" />
                  <span>Real-time order processing</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-primary mt-0.5" />
                  <span>Instant refunds if needed</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="w-12 h-12 bg-primary/10 flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-primary" />
              </div>
              <CardTitle>Privacy First</CardTitle>
              <CardDescription>
                Shop without compromising your privacy. No KYC, no data collection, no tracking.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-primary mt-0.5" />
                  <span>No identity verification required</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-primary mt-0.5" />
                  <span>Wallet-only authentication</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-primary mt-0.5" />
                  <span>Encrypted shipping details</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="w-12 h-12 bg-primary/10 flex items-center justify-center mb-4">
                <Globe className="w-6 h-6 text-primary" />
              </div>
              <CardTitle>Global Access</CardTitle>
              <CardDescription>
                Access millions of products worldwide. Shop from anywhere, ship to anywhere.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-primary mt-0.5" />
                  <span>195+ countries supported</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-primary mt-0.5" />
                  <span>Multi-marketplace integration</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-primary mt-0.5" />
                  <span>Automatic currency conversion</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-muted/50 py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="mb-4">Simple Process</Badge>
            <h2 className="text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Three simple steps to start shopping with crypto
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12 max-w-5xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary text-primary-foreground flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                1
              </div>
              <h3 className="text-xl font-semibold mb-3">Connect Wallet</h3>
              <p className="text-muted-foreground">
                Connect your crypto wallet in seconds. No registration, no personal information needed.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary text-primary-foreground flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                2
              </div>
              <h3 className="text-xl font-semibold mb-3">Paste Product Link</h3>
              <p className="text-muted-foreground">
                Copy any Amazon product URL and paste it into CryptoCart. We'll fetch all the details.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary text-primary-foreground flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                3
              </div>
              <h3 className="text-xl font-semibold mb-3">Pay & Ship</h3>
              <p className="text-muted-foreground">
                Complete payment with crypto and enter your shipping address. We handle the rest!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Supported Currencies */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <Badge className="mb-4">Payment Options</Badge>
          <h2 className="text-4xl font-bold mb-4">Accepted Cryptocurrencies</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Pay with your favorite crypto. More currencies added regularly.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6 max-w-4xl mx-auto">
          {['USDC', 'USDT', 'ETH', 'PUSH', 'BTC', 'MATIC'].map((crypto) => (
            <Card key={crypto} className="text-center">
              <CardContent className="pt-6">
                <div className="text-2xl font-bold mb-2">{crypto}</div>
                <Badge variant="secondary">Supported</Badge>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-y bg-muted/50">
        <div className="container mx-auto px-4 py-20 text-center">
          <h2 className="text-4xl font-bold mb-4">Ready to Start Shopping?</h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of users who are already shopping smarter with crypto.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="text-lg px-8 py-6">
              <Wallet className="w-5 h-5 mr-2" />
              Connect Wallet & Shop
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 py-6">
              Learn More
            </Button>
          </div>

          <p className="text-sm text-muted-foreground mt-8">
            No credit card required. Start shopping in under 30 seconds.
          </p>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <Badge className="mb-4">FAQ</Badge>
          <h2 className="text-4xl font-bold mb-4">Frequently Asked Questions</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Everything you need to know about CryptoCart
          </p>
        </div>

        <div className="max-w-3xl mx-auto space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center justify-between">
                <span>Is CryptoCart safe to use?</span>
                <ChevronDown className="w-5 h-5" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Yes! CryptoCart uses industry-standard security practices. Your crypto payments are processed on-chain, 
                and we never store your private keys or sensitive payment information.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center justify-between">
                <span>Do I need to create an account?</span>
                <ChevronDown className="w-5 h-5" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                No account needed! Simply connect your crypto wallet and start shopping immediately. 
                Your wallet address is your identity on CryptoCart.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center justify-between">
                <span>What happens if there's an issue with my order?</span>
                <ChevronDown className="w-5 h-5" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                We handle all order issues directly. If there's a problem with your Amazon order, 
                we'll process refunds back to your wallet automatically. Full buyer protection included.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center justify-between">
                <span>How long does shipping take?</span>
                <ChevronDown className="w-5 h-5" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Shipping times depend on the product and your location, just like regular Amazon orders. 
                You'll receive tracking information once your order ships.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-muted/50">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>Features</li>
                <li>How It Works</li>
                <li>Pricing</li>
                <li>Roadmap</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>About Us</li>
                <li>Blog</li>
                <li>Careers</li>
                <li>Press Kit</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Resources</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>Documentation</li>
                <li>API Reference</li>
                <li>Support</li>
                <li>Status</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Legal</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>Privacy Policy</li>
                <li>Terms of Service</li>
                <li>Cookie Policy</li>
                <li>Refund Policy</li>
              </ul>
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-primary flex items-center justify-center">
                <ShoppingCart className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold">CryptoCart</span>
            </div>
            
            <p className="text-sm text-muted-foreground">
              © 2025 CryptoCart. All rights reserved. Built with ❤️ for the crypto community.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default CryptoCartLanding;