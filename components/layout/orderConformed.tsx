import React, { useState, useEffect } from 'react';
import { CheckCircle2, Package, Truck, Home, Copy, ExternalLink, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

const OrderConfirmedPage = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const orderDetails = {
    orderId: 'CC-2025-001234',
    txHash: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb4',
    totalAmount: '$156.99',
    items: [
      {
        name: 'Wireless Bluetooth Headphones',
        quantity: 1,
        price: '$89.99'
      },
      {
        name: 'USB-C Charging Cable (2-Pack)',
        quantity: 2,
        price: '$24.99'
      }
    ],
    estimatedDelivery: 'Mar 15-18, 2025',
    shippingAddress: {
      name: 'John Doe',
      street: '123 Main Street, Apt 4B',
      city: 'New York, NY 10001',
      country: 'United States'
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      {/* <nav className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.location.href = '/'}>
            <div className="w-8 h-8 bg-primary flex items-center justify-center">
              <Package className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold">CryptoCart</span>
          </div>
          
          <Button variant="outline" onClick={() => window.location.href = '/cart'}>
            Continue Shopping
          </Button>
        </div>
      </nav> */}

      {/* Success Animation */}
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className={`text-center mb-12 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10'}`}>
          <div className="inline-block mb-6 relative">
            <div className="absolute inset-0 bg-green-500/20 rounded-full animate-ping" />
            <div className="relative bg-green-500/10 rounded-full p-6">
              <CheckCircle2 className="w-20 h-20 text-green-600 animate-bounce" style={{ animationDuration: '2s' }} />
            </div>
          </div>
          
          <h1 className="text-4xl font-bold mb-3">Order Confirmed!</h1>
          <p className="text-lg text-muted-foreground mb-2">
            Thank you for your purchase. Your order has been successfully placed.
          </p>
          <p className="text-sm text-muted-foreground">
            Order ID: <span className="font-mono font-semibold">{orderDetails.orderId}</span>
          </p>
        </div>

        {/* Order Timeline */}
        <Card className={`mb-6 transition-all duration-1000 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <CardHeader>
            <CardTitle>Order Status</CardTitle>
            <CardDescription>Track your order progress</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              <div className="flex items-start gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                    <CheckCircle2 className="w-6 h-6 text-white" />
                  </div>
                  <div className="w-0.5 h-16 bg-border mt-2" />
                </div>
                <div className="flex-1 pt-1">
                  <div className="font-semibold mb-1">Payment Confirmed</div>
                  <div className="text-sm text-muted-foreground">Your crypto payment has been received and confirmed</div>
                  <Badge variant="secondary" className="mt-2">Completed</Badge>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center animate-pulse">
                    <Package className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <div className="w-0.5 h-16 bg-border mt-2" />
                </div>
                <div className="flex-1 pt-1">
                  <div className="font-semibold mb-1">Processing Order</div>
                  <div className="text-sm text-muted-foreground">We're preparing your items for shipment</div>
                  <Badge className="mt-2">In Progress</Badge>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center">
                    <Truck className="w-6 h-6 text-muted-foreground" />
                  </div>
                  <div className="w-0.5 h-16 bg-border mt-2" />
                </div>
                <div className="flex-1 pt-1">
                  <div className="font-semibold mb-1">Shipped</div>
                  <div className="text-sm text-muted-foreground">Your order is on its way</div>
                  <Badge variant="outline" className="mt-2">Pending</Badge>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center">
                    <Home className="w-6 h-6 text-muted-foreground" />
                  </div>
                </div>
                <div className="flex-1 pt-1">
                  <div className="font-semibold mb-1">Delivered</div>
                  <div className="text-sm text-muted-foreground">Estimated: {orderDetails.estimatedDelivery}</div>
                  <Badge variant="outline" className="mt-2">Pending</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Order Details */}
          <Card className={`transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <CardHeader>
              <CardTitle>Order Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {orderDetails.items.map((item, index) => (
                <div key={index} className="flex justify-between">
                  <div className="flex-1">
                    <div className="font-medium text-sm">{item.name}</div>
                    <div className="text-xs text-muted-foreground">Qty: {item.quantity}</div>
                  </div>
                  <div className="font-semibold">{item.price}</div>
                </div>
              ))}
              
              <Separator />
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Subtotal</span>
                  <span>$139.97</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Shipping</span>
                  <span className="text-green-600">FREE</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Platform Fee</span>
                  <span>$2.00</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>FX Fee (1%)</span>
                  <span>$1.40</span>
                </div>
                <Separator />
                <div className="flex justify-between font-bold text-lg">
                  <span>Total Paid</span>
                  <span>{orderDetails.totalAmount}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Shipping & Payment Info */}
          <div className="space-y-6">
            <Card className={`transition-all duration-1000 delay-400 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <CardHeader>
                <CardTitle>Shipping Address</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm space-y-1">
                  <div className="font-semibold">{orderDetails.shippingAddress.name}</div>
                  <div className="text-muted-foreground">{orderDetails.shippingAddress.street}</div>
                  <div className="text-muted-foreground">{orderDetails.shippingAddress.city}</div>
                  <div className="text-muted-foreground">{orderDetails.shippingAddress.country}</div>
                </div>
              </CardContent>
            </Card>

            <Card className={`transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <CardHeader>
                <CardTitle>Payment Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <div className="text-sm font-medium mb-2">Payment Method</div>
                  <Badge>USDC (Push Chain)</Badge>
                </div>
                <div>
                  <div className="text-sm font-medium mb-2">Transaction Hash</div>
                  <div className="flex items-center gap-2">
                    <code className="text-xs bg-muted px-2 py-1 rounded flex-1 overflow-hidden text-ellipsis">
                      {orderDetails.txHash}
                    </code>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => copyToClipboard(orderDetails.txHash)}
                    >
                      {copied ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    </Button>
                    <Button size="sm" variant="outline">
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Action Buttons */}
        <div className={`flex flex-col sm:flex-row gap-4 mt-8 transition-all duration-1000 delay-600 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <Button className="flex-1" onClick={() => window.location.href = '/cart'}>
            Continue Shopping
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
          <Button variant="outline" className="flex-1">
            View All Orders
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmedPage;