'use client';
import React, { useState } from 'react';
import {  Home, Package} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

import { Separator } from '@/components/ui/separator';

import {
  toast
} from "sonner"
import {
  useForm
} from "react-hook-form"
import {
  zodResolver
} from "@hookform/resolvers/zod"
import {
  z
} from "zod"

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"

import {
  PhoneInput
} from "@/components/ui/phone-input";
import { redirect } from 'next/navigation';

 const CheckoutPage = () => {
      const [productUrl, setProductUrl] = useState('');
      const [isLoading, setIsLoading] = useState(false);
      const [cartItems, setCartItems] = useState([]);
      
      const [shippingData, setShippingData] = useState({
        fullName: '',
        phone: '',
        country: 'India',
        address: '',
        addressLine2: '',
        locality: '',
        city: '',
        pinCode: '',
        state: '',
        email: ''
      });
    
     const handleAddToCart = async () => {
    if (!productUrl) return;
    
    setIsLoading(true);
    setTimeout(() => {
      const newItem = {
        id: Date.now(),
        name: 'SAF Set of 3 Hexagon Preety Brown Floral UV Textured MDF...',
        price: 1.99,
        quantity: 1,
        image: 'https://via.placeholder.com/80'
      };
      setCartItems([...cartItems, newItem]);
      setProductUrl('');
      setIsLoading(false);
    }, 1500);
  };

  const calculateSubtotal = () => {
    return cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

    return (

        <div className="container mx-auto px-4 py-8">
            <Button
                variant="ghost"
                onClick={( ) => redirect('/cart')}
                className="mb-6"
            >
                ← Back to Cart
            </Button>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    <Card className="mb-6">
                        <CardHeader>
                            <CardTitle>Delivery Options</CardTitle>
                            <CardDescription>Choose delivery method</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="p-4 border-2 border-primary">
                                <div className="flex items-center gap-2 mb-1">
                                    <Home className="w-5 h-5" />
                                    <span className="font-semibold">Home Delivery</span>
                                </div>
                                <p className="text-sm text-muted-foreground">Deliver to your address</p>
                            </div>

                            <div className="p-4 border">
                                <div className="flex items-center gap-2 mb-1">
                                    <Package className="w-5 h-5" />
                                    <span className="font-semibold">Amazon Locker</span>
                                </div>
                                <p className="text-sm text-muted-foreground">Self-service pickup 24/7 • USA only</p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Add new address</CardTitle>
                        </CardHeader>
                        {/* **************************************************************************************** */}
                        <MyForm />
                    </Card>
                </div>

                <div>
                    <Card className="mb-6">
                        <CardHeader>
                            <CardTitle>Order Summary</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="flex justify-between">
                                <span>Subtotal</span>
                                <span>${calculateSubtotal().toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>FX conversion fee (1%)</span>
                                <span>$0.02</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Shipping</span>
                                <span>FREE</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Platform Fee</span>
                                <span>$2.00</span>
                            </div>
                            <Separator />
                            <div className="flex justify-between font-semibold text-lg">
                                <span>Total</span>
                                <span>$4.01</span>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="mb-6">
                        <CardHeader>
                            <CardTitle>Contact Email</CardTitle>
                            <CardDescription>Used for order confirmations and delivery updates</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                <div className="text-sm text-muted-foreground">Not provided</div>
                                <Button variant="outline" className="w-full">Add</Button>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Payment Method</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Select defaultValue="usdc">
                                <SelectTrigger className="mb-4">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="usdc">USDC (Recommended)</SelectItem>
                                    <SelectItem value="usdt">USDT</SelectItem>
                                    <SelectItem value="eth">ETH</SelectItem>
                                </SelectContent>
                            </Select>

                            <Button className="w-full py-6">
                                Pay $4.01 USDC
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
};

export default CheckoutPage;





const formSchema = z.object({
  name_1763352451: z.string().min(1).min(3),
  name_5207461461: z.string(),
  name_5964127267: z.string(),
  name_9660107398: z.string().min(1),
  name_4907378387: z.string().min(1),
  name_5486515113: z.string().min(1),
  name_6339123986: z.string().min(1),
  name_0662717037: z.number(),
  name_6443906174: z.string()
});

export  function MyForm() {

  const form = useForm < z.infer < typeof formSchema >> ({
    resolver: zodResolver(formSchema),

  })

  function onSubmit(values: z.infer < typeof formSchema > ) {
    try {
      console.log(values);
      toast(
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(values, null, 2)}</code>
        </pre>
      );
    } catch (error) {
      console.error("Form submission error", error);
      toast.error("Failed to submit the form. Please try again.");
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className=" max-w-3xl mx-auto">
        
        <FormField
          control={form.control}
          name="name_1763352451"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input 
                placeholder="Enter you Full Name"
                
                type="text"
                {...field} />
              </FormControl>
              
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="grid grid-cols-12 gap-4">
          
          <div className="col-span-6">
            
          <FormField
            control={form.control}
            name="name_5207461461"
            render={({ field }) => (
              <FormItem className="flex flex-col items-start">
              <FormLabel>Phone number</FormLabel>
                <FormControl className="w-full">
                  <PhoneInput
                    placeholder="Placeholder"
                    {...field}
                    defaultCountry="TR"
                  />
                </FormControl>
              <FormDescription>Enter your phone number.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
            
          </div>
          
          <div className="col-span-6">
            
        <FormField
          control={form.control}
          name="name_5964127267"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Country</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="*India" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="m@example.com">m@example.com</SelectItem>
                  <SelectItem value="m@google.com">m@google.com</SelectItem>
                  <SelectItem value="m@support.com">m@support.com</SelectItem>
                </SelectContent>
              </Select>
                
              <FormMessage />
            </FormItem>
          )}
        />
          </div>
          
        </div>
        
        <FormField
          control={form.control}
          name="name_9660107398"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Address</FormLabel>
              <FormControl>
                <Input 
                placeholder="Start entering you address"
                
                type=""
                {...field} />
              </FormControl>
              <FormDescription>Enter your Shipping address</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="name_4907378387"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Address 2</FormLabel>
              <FormControl>
                <Input 
                placeholder="Start entering you address"
                
                type=""
                {...field} />
              </FormControl>
              <FormDescription>Enter your Shipping address</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="name_5486515113"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Locality [Area/Society/Colony/Sector]</FormLabel>
              <FormControl>
                <Input 
                placeholder="Area/Society/Colony/Sector"
                
                type=""
                {...field} />
              </FormControl>
              <FormDescription>Required for India addresses</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="grid grid-cols-12 gap-4">
          
          <div className="col-span-6">
            
        <FormField
          control={form.control}
          name="name_6339123986"
          render={({ field }) => (
            <FormItem>
              <FormLabel>City</FormLabel>
              <FormControl>
                <Input 
                placeholder=""
                
                type=""
                {...field} />
              </FormControl>
              
              <FormMessage />
            </FormItem>
          )}
        />
          </div>
          
          <div className="col-span-6">
            
        <FormField
          control={form.control}
          name="name_0662717037"
          render={({ field }) => (
            <FormItem>
              <FormLabel>PIN Code</FormLabel>
              <FormControl>
                <Input 
                placeholder=""
                
                type="number"
                {...field} />
              </FormControl>
              
              <FormMessage />
            </FormItem>
          )}
        />
          </div>
          
        </div>
        
        <FormField
          control={form.control}
          name="name_6443906174"
          render={({ field }) => (
            <FormItem>
              <FormLabel>State</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select State" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="m@example.com">m@example.com</SelectItem>
                  <SelectItem value="m@google.com">m@google.com</SelectItem>
                  <SelectItem value="m@support.com">m@support.com</SelectItem>
                </SelectContent>
              </Select>
                
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  )
}