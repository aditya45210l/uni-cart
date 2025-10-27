'use client';
import React, { useEffect, useState } from 'react';
import {PushChain } from '@pushchain/core';
import { Home, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { PhoneInput } from "@/components/ui/phone-input";
import { redirect } from 'next/navigation';
import { getCartByWallet } from '@/lib/utils/cart-api';
import { saveUserProfile } from '@/lib/utils/user-api'; // ⬅️ Import the user helper
import { usePushChainClient } from '@pushchain/ui-kit';
import abi from '@/lib/utils/abi.json'
import OrderConfirmedPage from '@/components/layout/orderConformed';

// --- Form Schema Mapping (Based on your random names) ---
const addressFormSchema = z.object({
    fullName: z.string().min(3, "Full name is required"),
    phone: z.string().min(10, "Phone number is required"), // You may need a more robust phone validation
    country: z.string().min(1, "Country is required"),
    address: z.string().min(1, "Address Line 1 is required"),
    addressLine2: z.string().optional(),
    locality: z.string().min(1, "Locality is required"),
    city: z.string().min(1, "City is required"),
    pinCode: z.coerce.number().min(100000, "PIN code is required").max(999999, "Invalid PIN code"), // Using coerce to handle Input type="number"
    state: z.string().min(1, "State is required"),
    email: z.string().email("Invalid email address").optional(), // Assuming you will add email input later
});

// Helper function to map your current randomized names to descriptive names
type FormSchemaKeys = keyof z.infer<typeof addressFormSchema>;
const fieldMap: Record<string, FormSchemaKeys> = {
    name_1763352451: 'fullName',
    name_5207461461: 'phone',
    name_5964127267: 'country',
    name_9660107398: 'address',
    name_4907378387: 'addressLine2',
    name_5486515113: 'locality',
    name_6339123986: 'city',
    name_0662717037: 'pinCode',
    name_6443906174: 'state',
    // Assume we'll add email input with name_email for contact
};
// --------------------------------------------------------

const CheckoutPage = () => {
    const { pushChainClient } = usePushChainClient();
    const [isLoading, setIsLoading] = useState(false);
    const [rawCart, setRawCart] = useState<any>(null);
    const [selectedCurrency, setSelectedCurrency] = useState('usdc'); // ⬅️ Added currency state
    const [orderConfirmed, setOrderConfirmed] = useState(false);
    

    // Define fixed fees and rates
    const PLATFORM_FEE_USD = 2.00;
    const FX_CONVERSION_RATE = 0.01; // 1%

    // --- Order Summary Calculation ---
    const calculateOrderSummary = (cartTotal: number) => {
        const subtotal = cartTotal;
        const fxFee = subtotal * FX_CONVERSION_RATE;
        const platformFee = PLATFORM_FEE_USD;
        const shipping = 0.00;
        const total = subtotal + fxFee + platformFee + shipping;

        return { subtotal, fxFee, platformFee, shipping, total };
    };

const handleCheckout = async (amount: string) => {
  try {
    if (!pushChainClient) return;

    const usdt = pushChainClient.moveable.token.USDT;
    const oneCents = PushChain.utils.helpers.parseUnits(amount, { decimals: usdt.decimals });
// Send 1 USDT to the recipient address
    const res = await pushChainClient.universal.sendTransaction({
      to: pushChainClient.universal.account,
      funds: { amount: oneCents, token: usdt },
    });

    console.log('Transaction sent. Waiting for confirmation...', res);
    setOrderConfirmed(true);
    const receipt = await res.wait();
    
    console.log('✅ Sent. Tx:', receipt);
  } catch (err) {
    console.error('Checkout error:', err);
  }
};

    
    // Get summary based on fetched cart total
    const cartTotalFromDB = rawCart?.totalPriceUSD || 0;
    const summary = calculateOrderSummary(cartTotalFromDB);
    const displayTotal = summary.total.toFixed(2);
    const displayCurrency = selectedCurrency.toUpperCase();
    // ---------------------------------

    // --- Cart Fetching Logic ---
    const fetchCart = async () => {
        setIsLoading(true);
        try {
            if (!pushChainClient?.universal?.origin?.address) {
                toast.warning("Please connect your wallet to view checkout.");
                return;
            }
            const walletAddress = pushChainClient.universal.origin.address as string;
            const fetchedCart = await getCartByWallet(walletAddress);
            setRawCart(fetchedCart);
            if (fetchedCart) {
                toast.success(`Cart loaded successfully with ${fetchedCart.items.length} items!`);
            } else {
                toast.info("No active cart found.");
            }
        } catch (error) {
            console.error("Error fetching cart on page load:", error);
            toast.error("Failed to load your cart. Please refresh the page.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (pushChainClient) {
            fetchCart();
        }
    }, [pushChainClient]);
    // ----------------------------


    // --- Shipping Address Form Logic ---
    const form = useForm<z.infer<typeof addressFormSchema>>({
        resolver: zodResolver(addressFormSchema),
        defaultValues: {
            fullName: "",
            phone: "",
            country: "India", // Set default to match Select
            address: "",
            addressLine2: "",
            locality: "",
            city: "",
            pinCode: 0, // Default to 0, Zod will handle min/max
            state: "",
            email: ""
        }
    });

    async function onSubmit(values: z.infer<typeof addressFormSchema>) {
        console.log("Form Values on Submit:", values);
        if (!pushChainClient?.universal?.origin?.address) {
            toast.error("Wallet not connected. Cannot save address.");
            return;
        }

        const walletAddress = pushChainClient.universal.origin.address as string;
        
        // 1. Prepare Shipping Address object for API
        const shippingAddress = {
            fullName: values.fullName,
            phone: values.phone,
            country: values.country,
            address: values.address,
            addressLine2: values.addressLine2,
            locality: values.locality,
            city: values.city,
            pinCode: String(values.pinCode), // Convert number back to string for backend consistency if needed
            state: values.state,
            // Note: Email is handled separately if needed for contact
        };

        const payload = {
            walletAddress: walletAddress,
            email: values.email, // Or pull from a separate email field if you add one
            name: values.fullName,
            shippingAddress: shippingAddress,
        };

        try {
            // 2. Call the upsertUser helper function
            const updatedUser = await upsertUser(payload);

            if (updatedUser) {
                toast.success("Shipping address saved successfully!");
                console.log("Updated User:", updatedUser);
            } else {
                toast.error("Failed to save address. Please check your inputs.");
            }
        } catch (error) {
            console.error("Address submission error:", error);
            toast.error("An unexpected error occurred while saving the address.");
        }
    }
    // -----------------------------------

    // --- MyForm Component (Inline or as a nested component for clean structure) ---
    // Note: I'm defining MyForm inside CheckoutPage to easily access 'form' and 'onSubmit'
    const MyForm = () => (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="p-6 space-y-4">
                <FormField
                    control={form.control}
                    name="fullName"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Full Name</FormLabel>
                            <FormControl>
                                <Input placeholder="Enter your Full Name" type="text" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                            <FormItem className="flex flex-col items-start">
                                <FormLabel>Phone number</FormLabel>
                                <FormControl className="w-full">
                                    <PhoneInput placeholder="Enter phone number" {...field} defaultCountry="US" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="country"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Country</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select Country" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="India">India</SelectItem>
                                        <SelectItem value="USA">USA</SelectItem>
                                        <SelectItem value="UK">UK</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Address Line 1</FormLabel>
                            <FormControl>
                                <Input placeholder="Street address, P.O. Box, company name, c/o" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="addressLine2"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Address Line 2 (Optional)</FormLabel>
                            <FormControl>
                                <Input placeholder="Apartment, suite, unit, building, floor, etc." {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="locality"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Locality [Area/Society/Colony/Sector]</FormLabel>
                            <FormControl>
                                <Input placeholder="Area/Society/Colony/Sector" {...field} />
                            </FormControl>
                            <FormDescription>Required for India addresses</FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField
                        control={form.control}
                        name="city"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>City</FormLabel>
                                <FormControl>
                                    <Input placeholder="City" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="pinCode"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>PIN Code</FormLabel>
                                <FormControl>
                                    {/* Use onChange to ensure value is treated as number before Zod coerce */}
                                    <Input 
                                        placeholder="PIN Code" 
                                        type="number" 
                                        {...field} 
                                        onChange={(e) => field.onChange(e.target.value === '' ? '' : Number(e.target.value))}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="state"
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
                                        <SelectItem value="MH">Maharashtra</SelectItem>
                                        <SelectItem value="DL">Delhi</SelectItem>
                                        <SelectItem value="KA">Karnataka</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                
                <Button type="submit" className="w-full mt-6">Save Address</Button>
            </form>
        </Form>
    );
    // ------------------------------------------------------------------------

    if (isLoading && !rawCart) {
        return <div className="p-8 text-center">Loading checkout details...</div>;
    }

    return (
        <>
        {
            orderConfirmed ? (<OrderConfirmedPage/>):(<div className="container mx-auto px-4 py-8">
            <Button
                variant="ghost"
                onClick={() => redirect('/cart')}
                className="mb-6"
            >
                ← Back to Cart
            </Button>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    {/* Delivery Options Card */}
                    <Card className="mb-6">
                        {/* ... (Delivery Card content) ... */}
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
                        </CardContent>
                    </Card>

                    {/* Address Form Card */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Add new address</CardTitle>
                        </CardHeader>
                        <MyForm /> 
                    </Card>
                </div>

                <div>
                    {/* Order Summary Card (using dynamic summary) */}
                    <Card className="mb-6">
                        <CardHeader>
                            <CardTitle>Order Summary</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="flex justify-between">
                                <span>Subtotal</span>
                                <span>${summary.subtotal.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>FX conversion fee (1%)</span>
                                <span>${summary.fxFee.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Shipping</span>
                                <span className="text-green-500">FREE</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Platform Fee</span>
                                <span>${summary.platformFee.toFixed(2)}</span>
                            </div>

                            <Separator />

                            <div className="flex justify-between font-semibold text-lg">
                                <span>Total</span>
                                <span>${summary.total.toFixed(2)}</span>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Contact Email Card (You'll need to integrate email submission here) */}
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

                    {/* Payment Method Card (using dynamic total and currency) */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Payment Method</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Select
                                defaultValue={selectedCurrency}
                                onValueChange={(value) => setSelectedCurrency(value)}
                            >
                                <SelectTrigger className="mb-4">
                                    <SelectValue placeholder="Select a currency" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="usdc">USDC (Recommended)</SelectItem>
                                    <SelectItem value="usdt">USDT</SelectItem>
                                    <SelectItem value="eth">ETH</SelectItem>
                                </SelectContent>
                            </Select>

                            <Button className="w-full py-6" onClick={() => handleCheckout(displayTotal)}>
                                {`Pay $${displayTotal} ${displayCurrency}`}
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>)
        }
        </>
    );
};

export default CheckoutPage;