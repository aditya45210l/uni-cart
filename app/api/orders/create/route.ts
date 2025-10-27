// src/app/api/orders/create/route.ts
import { NextRequest, NextResponse } from 'next/server';
import axios, { AxiosError } from 'axios';

// ⚠️ IMPORTANT: Get your client token from environment variables
const ZINC_CLIENT_TOKEN = process.env.ZINC_CLIENT_TOKEN;
const ZINC_API_URL = 'https://api.zinc.io/v1/orders';


// --- Zinc API Types (Refined for optional fields) ---

interface ZincAddress {
    first_name: string;
    last_name: string;
    address_line1: string;
    address_line2?: string; // Optional
    zip_code: string;
    city: string;
    state: string; // USPS abbreviation (e.g., MH for Maharashtra)
    country: string; // ISO abbreviation (e.g., IN for India)
    phone_number: string;
    instructions?: string; // Optional
}

interface ZincProduct {
    product_id: string;
    quantity: number;
    // seller_selection_criteria is optional, but include if needed
}

interface CreateOrderPayload {
    retailer: 'amazon';
    products: ZincProduct[];
    shipping_address: ZincAddress;
    shipping_method?: 'cheapest' | 'fastest' | 'free'; // Optional if 'shipping' is used
    shipping?: Record<string, any>; // Optional if 'shipping_method' is used
    
    // Credentials for self-managed accounts
    retailer_credentials: {
        email: string;
        password: string;
    };
    
    // Payment method for gift card/balance
    payment_method: {
        use_gift: true; 
    };
    
    // Other optional fields
    billing_address?: ZincAddress; // Optional
    is_gift?: boolean;             // Optional
    gift_message?: string;         // Optional
    client_notes?: Record<string, any>; // Optional
}
// -----------------------------------------------------


// POST - Create a new order via Zinc API
export async function POST(request: NextRequest) {
    if (!ZINC_CLIENT_TOKEN) {
        return NextResponse.json({ error: 'Server configuration error: ZINC_CLIENT_TOKEN is missing' }, { status: 500 });
    }
    
    try {
        const payload: CreateOrderPayload = await request.json();
        
        // Basic Validation
        if (!payload.products || !payload.shipping_address || !payload.retailer_credentials) {
            return NextResponse.json({ error: 'Missing required payload fields: products, shipping_address, or retailer_credentials' }, { status: 400 });
        }

        // Authorization Header (Basic Auth: Token as username, password blank)
        const authHeader = `Basic ${Buffer.from(`${ZINC_CLIENT_TOKEN}:`).toString('base64')}`;

        // Prepare the payload for Zinc
        const zincPayload = {
            ...payload,
            retailer: 'amazon',
            payment_method: {
                use_gift: true, // Forces use of Amazon Pay Balance/Gift Card
            },
        };

        const zincResponse = await axios.post(ZINC_API_URL, zincPayload, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': authHeader,
            }
        });

        // Success response from Zinc
        return NextResponse.json(zincResponse.data, { status: 200 });
        
    } catch (error) {
        // Handle Axios and Zinc API errors
        const axiosError = error as AxiosError;
        if (axios.isAxiosError(error) && axiosError.response) {
            console.error("Zinc API Error:", axiosError.response.data);
            return NextResponse.json(
                { 
                    error: 'Failed to create order with Zinc API', 
                    details: axiosError.response.data 
                }, 
                { status: axiosError.response.status }
            );
        }

        console.error('API Route Error:', error);
        return NextResponse.json(
            { error: 'Internal server error processing order request' },
            { status: 500 }
        );
    }
}