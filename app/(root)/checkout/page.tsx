'use client';
import React, { useEffect, useState } from 'react';
import { PushChain } from '@pushchain/core';
import { Home, Package, Loader2 } from 'lucide-react';
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
import { useRouter } from 'next/navigation';
import { getCartByWallet } from '@/lib/utils/cart-api';
import { saveUserProfile } from '@/lib/utils/user-api';
import { usePushChainClient } from '@pushchain/ui-kit';
import OrderConfirmedPage from '@/components/layout/orderConformed';

// Form Schema
const addressFormSchema = z.object({
    fullName: z.string().min(3, "Full name is required"),
    phone: z.string().min(10, "Phone number is required"),
    country: z.string().min(1, "Country is required"),
    address: z.string().min(1, "Address Line 1 is required"),
    addressLine2: z.string().optional(),
    locality: z.string().min(1, "Locality is required"),
    city: z.string().min(1, "City is required"),
    pinCode: z.string().min(5, "PIN code is required"),
    state: z.string().min(1, "State is required"),
    email: z.string().email("Invalid email address").optional(),
});

const CheckoutPage = () => {
    const router = useRouter();
    const { pushChainClient } = usePushChainClient();
    
    // Loading states
    const [isLoadingCart, setIsLoadingCart] = useState(false);
    const [isSavingAddress, setIsSavingAddress] = useState(false);
    const [isProcessingPayment, setIsProcessingPayment] = useState(false);
    
    // Data states
    const [rawCart, setRawCart] = useState<any>(null);
    const [selectedCurrency, setSelectedCurrency] = useState('usdc');
    const [orderConfirmed, setOrderConfirmed] = useState(false);
    const [addressSaved, setAddressSaved] = useState(false);

    // Fixed fees and rates
    const PLATFORM_FEE_USD = 2.00;
    const FX_CONVERSION_RATE = 0.01; // 1%

    // Calculate Order Summary
    const calculateOrderSummary = (cartTotal: number) => {
        const subtotal = cartTotal;
        const fxFee = subtotal * FX_CONVERSION_RATE;
        const platformFee = PLATFORM_FEE_USD;
        const shipping = 0.00;
        const total = subtotal + fxFee + platformFee + shipping;

        return { subtotal, fxFee, platformFee, shipping, total };
    };

    const cartTotalFromDB = rawCart?.totalPriceUSD || 0;
    const summary = calculateOrderSummary(cartTotalFromDB);
    const displayTotal = summary.total.toFixed(2);
    const displayCurrency = selectedCurrency.toUpperCase();

    // Checkout Handler with Loading State
    const handleCheckout = async (amount: string) => {
        // Check if address is saved first
        if (!addressSaved) {
            toast.error("Please save your shipping address before checkout");
            return;
        }

        if (!pushChainClient) {
            toast.error("Wallet not connected");
            return;
        }

        setIsProcessingPayment(true);
        
        try {
            const usdt = pushChainClient.moveable.token.USDT;
            const oneCents = PushChain.utils.helpers.parseUnits(amount, { decimals: usdt.decimals });

            toast.loading("Sending transaction...", { id: "checkout-tx" });

            const res = await pushChainClient.universal.sendTransaction({
                to: pushChainClient.universal.account,
                funds: { amount: oneCents, token: usdt },
            });

            console.log('Transaction sent. Waiting for confirmation...', res);
            
            toast.loading("Confirming transaction...", { id: "checkout-tx" });
            
            const receipt = await res.wait();
            
            console.log('✅ Sent. Tx:', receipt);
            
            toast.success("Payment successful!", { id: "checkout-tx" });
            
            setOrderConfirmed(true);
        } catch (err) {
            console.error('Checkout error:', err);
            toast.error("Payment failed. Please try again.", { id: "checkout-tx" });
        } finally {
            setIsProcessingPayment(false);
        }
    };

    // Fetch Cart on Load
    const fetchCart = async () => {
        setIsLoadingCart(true);
        try {
            if (!pushChainClient?.universal?.origin?.address) {
                toast.warning("Please connect your wallet to view checkout.");
                router.push('/cart');
                return;
            }
            
            const walletAddress = pushChainClient.universal.origin.address as string;
            const fetchedCart = await getCartByWallet(walletAddress);
            
            if (!fetchedCart || fetchedCart.items.length === 0) {
                toast.info("Your cart is empty. Redirecting...");
                router.push('/cart');
                return;
            }
            
            setRawCart(fetchedCart);
            toast.success(`Cart loaded with ${fetchedCart.items.length} items!`);
        } catch (error) {
            console.error("Error fetching cart:", error);
            toast.error("Failed to load your cart.");
            router.push('/cart');
        } finally {
            setIsLoadingCart(false);
        }
    };

    useEffect(() => {
        if (pushChainClient) {
            fetchCart();
        }
    }, [pushChainClient]);

    // Shipping Address Form
    const form = useForm<z.infer<typeof addressFormSchema>>({
        resolver: zodResolver(addressFormSchema),
        defaultValues: {
            fullName: "",
            phone: "",
            country: "India",
            address: "",
            addressLine2: "",
            locality: "",
            city: "",
            pinCode: "",
            state: "",
            email: ""
        }
    });

    // Form Submit Handler with Loading State
    const onSubmit = async (values: z.infer<typeof addressFormSchema>) => {
        console.log("Form Values on Submit:", values);
        
        if (!pushChainClient?.universal?.origin?.address) {
            toast.error("Wallet not connected. Cannot save address.");
            return;
        }

        setIsSavingAddress(true);

        const walletAddress = pushChainClient.universal.origin.address as string;
        
        const shippingAddress = {
            fullName: values.fullName,
            phone: values.phone,
            country: values.country,
            address: values.address,
            addressLine2: values.addressLine2 || "",
            locality: values.locality,
            city: values.city,
            pinCode: values.pinCode,
            state: values.state,
        };

        const payload = {
            walletAddress: walletAddress,
            email: values.email || "",
            name: values.fullName,
            shippingAddress: shippingAddress,
        };

        try {
            toast.loading("Saving address...", { id: "save-address" });
            
            const updatedUser = await saveUserProfile(payload);

            if (updatedUser) {
                toast.success("Shipping address saved successfully!", { id: "save-address" });
                setAddressSaved(true);
                console.log("Updated User:", updatedUser);
            } else {
                toast.error("Failed to save address. Please try again.", { id: "save-address" });
            }
        } catch (error) {
            console.error("Address submission error:", error);
            toast.error("An error occurred while saving the address.", { id: "save-address" });
        } finally {
            setIsSavingAddress(false);
        }
    };

    // Loading State
    if (isLoadingCart) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4" />
                    <p className="text-lg font-medium">Loading checkout details...</p>
                </div>
            </div>
        );
    }

    // Order Confirmed State
    if (orderConfirmed) {
        return <OrderConfirmedPage />;
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <Button
                variant="ghost"
                onClick={() => router.push('/cart')}
                className="mb-6"
            >
                ← Back to Cart
            </Button>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    {/* Delivery Options Card */}
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
                        </CardContent>
                    </Card>

                    {/* Address Form Card */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Shipping Address</CardTitle>
                            <CardDescription>
                                {addressSaved ? "✅ Address saved successfully" : "Please fill in your shipping details"}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                                    <FormField
                                        control={form.control}
                                        name="fullName"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Full Name</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Enter your Full Name" {...field} />
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
                                                        <PhoneInput placeholder="Enter phone number" {...field} defaultCountry="IN" />
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
                                                        <Input placeholder="PIN Code" {...field} />
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

                                    <FormField
                                        control={form.control}
                                        name="email"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Email (Optional)</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="your.email@example.com" type="email" {...field} />
                                                </FormControl>
                                                <FormDescription>For order confirmations</FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <Button 
                                        type="submit" 
                                        className="w-full mt-6" 
                                        disabled={isSavingAddress || addressSaved}
                                    >
                                        {isSavingAddress ? (
                                            <>
                                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                                Saving Address...
                                            </>
                                        ) : addressSaved ? (
                                            "✅ Address Saved"
                                        ) : (
                                            "Save Address"
                                        )}
                                    </Button>
                                </form>
                            </Form>
                        </CardContent>
                    </Card>
                </div>

                <div>
                    {/* Order Summary Card */}
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

                    {/* Payment Method Card */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Payment Method</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Select
                                defaultValue={selectedCurrency}
                                onValueChange={(value) => setSelectedCurrency(value)}
                                disabled={isProcessingPayment}
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

                            <Button 
                                className="w-full py-6" 
                                onClick={() => handleCheckout(displayTotal)}
                                disabled={!addressSaved || isProcessingPayment}
                            >
                                {isProcessingPayment ? (
                                    <>
                                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                        Processing Payment...
                                    </>
                                ) : !addressSaved ? (
                                    "Please Save Address First"
                                ) : (
                                    `Pay $${displayTotal} ${displayCurrency}`
                                )}
                            </Button>
                            
                            {!addressSaved && (
                                <p className="text-xs text-muted-foreground text-center mt-2">
                                    ⚠️ You must save your shipping address before checkout
                                </p>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default CheckoutPage;