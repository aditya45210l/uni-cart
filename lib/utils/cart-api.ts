// src/utils/cart-api.ts
import axios from 'axios';
import { Cart, ApiResponse, AddItemToCartPayload } from '@/types/cart'; // Adjust path as needed

const CART_API_URL = '/api/cart'; // Your Next.js API route path

/**
 * 🛒 Fetches the active cart for a given user wallet address.
 * Corresponds to your API's GET request.
 * @param walletAddress The user's wallet address.
 * @returns A promise that resolves to the Cart object or null on failure.
 */
export async function getCartByWallet(walletAddress: string): Promise<Cart | null> {
  try {
    const response = await axios.get<ApiResponse<Cart>>(
      `${CART_API_URL}?walletAddress=${walletAddress}`
    );
    
    // Check if the response contains a cart
    if (response.data.cart) {
      return response.data.cart;
    }

    // Handle API-level errors (e.g., user not found, 400 status)
    if (response.data.error) {
        console.error('API Error fetching cart:', response.data.error);
    }
    
    return null;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      // Log specific status/error from the API
      console.error(
        `Error fetching cart (Status: ${error.response.status}):`,
        error.response.data.error || 'Unknown error'
      );
    } else {
      console.error('Network or unknown error fetching cart:', error);
    }
    return null;
  }
}

/**
 * ➕ Adds an item to the user's cart or updates its quantity.
 * Corresponds to your API's POST request.
 * @param payload The item and user details to add to the cart.
 * @returns A promise that resolves to the updated Cart object or null on failure.
 */
export async function addItemToCart(payload: AddItemToCartPayload): Promise<Cart | null> {
  try {
    console.log("Adding item to cart with payload:", payload);
    const response = await axios.post<ApiResponse<Cart>>(
      CART_API_URL, 
      payload
    );

    if (response.data.cart) {
      return response.data.cart;
    }
    
    if (response.data.error) {
        console.error('API Error adding item to cart:', response.data.error);
    }

    return null;

  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      // Log specific status/error from the API
      console.error(
        `Error adding item to cart (Status: ${error.response.status}):`,
        error.response.data.error || 'Unknown error'
      );
    } else {
      console.error('Network or unknown error adding item to cart:', error);
    }
    return null;
  }
}