import axios from "axios";

export async function saveUserProfile(data: {
  walletAddress: string;
  email?: string;
  name?: string;
  shippingAddress?: {
    fullName?: string;
    street?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
    phone?: string;
  };
},) {
  try {

    const res = (await axios.post('/api/users',data)).data;


    if (!res.ok) {

      throw new Error('Failed to save user');
    }

    return res.data;
  } catch (error) {
    console.error('❌ Error saving user profile:', error);
    throw error;
  }
}


// Define a type for the User object based on your schema
interface UserProfile {
  walletAddress: string;
  email?: string;
  name?: string;
  shippingAddress?: {
    fullName?: string;
    street?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
    phone?: string;
  };
  // Add other user fields as needed
}

export async function getUserProfile(walletAddress: string): Promise<UserProfile | null> {
  if (!walletAddress) {
    throw new Error('Wallet address is required to fetch profile.');
  }

  // 1. Construct the URL with the walletAddress as a query parameter
  const url = `/api/users?walletAddress=${walletAddress.toLowerCase()}`;

  try {
    // 2. Call the GET API route
    const response = await axios.get(url);

    // 3. On success (200 status), the user object is in response.data.user
    // Your API returns { user: {...} }
    return response.data.user as UserProfile;

  } catch (error) {
    // 4. Axios throws an error on 4xx/5xx status codes.
    if (axios.isAxiosError(error) && error.response) {
      const status = error.response.status;
      const serverError = error.response.data?.error || 'Unknown Server Error';

      if (status === 404) {
        // User not found, which is an expected scenario. Return null.
        console.info(`User not found for address: ${walletAddress}`);
        return null; 
      }
      
      // For 400 (Bad Request) or 500 (Server Error), throw a meaningful error.
      console.error(`❌ API Error (${status}) fetching user:`, serverError);
      throw new Error(`Failed to fetch user profile: ${serverError}`);
    }

    // 5. Handle network errors (no response)
    console.error('❌ Network Error fetching user profile:', error);
    throw new Error('Network error or connection lost.');
  }
}