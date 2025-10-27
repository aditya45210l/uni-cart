'use client'
import React, { useState, useEffect } from 'react';
import { Wrench, Rocket, Sparkles, ArrowLeft, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

const UnderDevelopmentPage = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [floatingIcons, setFloatingIcons] = useState([]);

  useEffect(() => {
    setIsVisible(true);
    
    // Create floating icons
    const icons = Array.from({ length: 6 }, (_, i) => ({
      id: i,
      delay: i * 0.5,
      duration: 3 + (i % 3),
    }));
    setFloatingIcons(icons);
  }, []);

  const handleSubscribe = () => {
    if (email) {
      setSubscribed(true);
      setTimeout(() => {
        setSubscribed(false);
        setEmail('');
      }, 3000);
    }
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Floating Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {floatingIcons.map((icon) => (
          <div
            key={icon.id}
            className="absolute animate-float opacity-10"
            style={{
              left: `${15 + (icon.id * 15)}%`,
              animationDelay: `${icon.delay}s`,
              animationDuration: `${icon.duration}s`,
            }}
          >
            {icon.id % 3 === 0 ? (
              <Wrench className="w-16 h-16" />
            ) : icon.id % 3 === 1 ? (
              <Rocket className="w-16 h-16" />
            ) : (
              <Sparkles className="w-16 h-16" />
            )}
          </div>
        ))}
      </div>

      {/* Navigation */}
      <nav className="border-b relative z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.location.href = '/'}>
            <div className="w-8 h-8 bg-primary flex items-center justify-center">
              <Wrench className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold">CryptoCart</span>
          </div>
          
          <Button variant="outline" onClick={() => window.location.href = '/'}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          {/* Animated Icon */}
          <div className={`mb-8 transition-all duration-1000 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}`}>
            <div className="inline-block relative">
              <div className="absolute inset-0 bg-primary/20 rounded-full animate-ping" />
              <div className="relative bg-primary/10 rounded-full p-8">
                <Wrench className="w-24 h-24 text-primary animate-spin-slow" />
              </div>
            </div>
          </div>

          {/* Title with Animation */}
          <div className={`mb-6 transition-all duration-1000 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <Badge className="mb-4 animate-bounce" style={{ animationDuration: '2s' }}>
              <Sparkles className="w-3 h-3 mr-1" />
              Coming Soon
            </Badge>
            <h1 className="text-5xl md:text-6xl font-bold mb-4">
              We're Building
              <span className="block bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                Something Amazing
              </span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              This feature is currently under development. We're working hard to bring you an incredible experience!
            </p>
          </div>

          {/* Progress Indicator */}
          <Card className={`mb-8 transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <CardHeader>
              <CardTitle className="flex items-center justify-center gap-2">
                <Rocket className="w-5 h-5" />
                Development Progress
              </CardTitle>
              <CardDescription>We're making great progress!</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Overall Progress</span>
                    <span className="font-semibold">75%</span>
                  </div>
                  <div className="h-3 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary rounded-full transition-all duration-2000 animate-progress"
                      style={{ width: '75%' }}
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-4 pt-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold mb-1">✓</div>
                    <div className="text-sm font-medium">Design Complete</div>
                    <div className="text-xs text-muted-foreground">100%</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold mb-1 animate-pulse">⚙️</div>
                    <div className="text-sm font-medium">Development</div>
                    <div className="text-xs text-muted-foreground">75%</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold mb-1">🔄</div>
                    <div className="text-sm font-medium">Testing</div>
                    <div className="text-xs text-muted-foreground">50%</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Timeline */}
          <Card className={`mb-8 transition-all duration-1000 delay-400 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <CardHeader>
              <CardTitle>What's Coming</CardTitle>
              <CardDescription>Features we're building for you</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 text-left">
                <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2" />
                  <div>
                    <div className="font-medium mb-1">Enhanced Product Search</div>
                    <div className="text-sm text-muted-foreground">Smart search with AI-powered recommendations</div>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 animate-pulse" />
                  <div>
                    <div className="font-medium mb-1">Multi-Currency Support</div>
                    <div className="text-sm text-muted-foreground">Pay with BTC, ETH, and more cryptocurrencies</div>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                  <div className="w-2 h-2 bg-muted-foreground rounded-full mt-2" />
                  <div>
                    <div className="font-medium mb-1">Real-Time Order Tracking</div>
                    <div className="text-sm text-muted-foreground">Live updates from warehouse to doorstep</div>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                  <div className="w-2 h-2 bg-muted-foreground rounded-full mt-2" />
                  <div>
                    <div className="font-medium mb-1">Wishlist & Favorites</div>
                    <div className="text-sm text-muted-foreground">Save products and get price alerts</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Newsletter Signup */}
          <Card className={`transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <CardHeader>
              <CardTitle className="flex items-center justify-center gap-2">
                <Bell className="w-5 h-5" />
                Get Notified
              </CardTitle>
              <CardDescription>
                Be the first to know when this feature launches
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!subscribed ? (
                <div className="flex gap-2">
                  <Input
                    type="email"
                    placeholder="your.email@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="flex-1"
                  />
                  <Button onClick={handleSubscribe}>
                    Notify Me
                  </Button>
                </div>
              ) : (
                <div className="text-center py-4 animate-fade-in">
                  <div className="text-green-600 font-semibold mb-1 flex items-center justify-center gap-2">
                    <Sparkles className="w-5 h-5" />
                    Thanks for subscribing!
                  </div>
                  <div className="text-sm text-muted-foreground">
                    We'll notify you as soon as this feature is ready.
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className={`flex flex-col sm:flex-row gap-4 mt-8 transition-all duration-1000 delay-600 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <Button variant="outline" className="flex-1" onClick={() => window.location.href = '/'}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
            <Button className="flex-1" onClick={() => window.location.href = '/cart'}>
              Start Shopping
            </Button>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-30px) rotate(5deg);
          }
        }

        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes progress {
          from {
            width: 0%;
          }
          to {
            width: 75%;
          }
        }

        @keyframes fade-in {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }

        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }

        .animate-progress {
          animation: progress 2s ease-out;
        }

        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }
      `}</style>
    </div>
  );
};

export default UnderDevelopmentPage;