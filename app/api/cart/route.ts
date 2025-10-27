import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb/mongodbConfig';
import Cart from '@/lib/mongodb/schema/CartSchema';
import User from '@/lib/mongodb/schema/UserSchema';

// GET - Get cart by user wallet
export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    
    const searchParams = request.nextUrl.searchParams;
    const walletAddress = searchParams.get('walletAddress');

    if (!walletAddress) {
      return NextResponse.json(
        { error: 'Wallet address is required' },
        { status: 400 }
      );
    }

    const user = await User.findOne({ walletAddress: walletAddress.toLowerCase() });
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    let cart = await Cart.findOne({ userId: user._id, status: 'active' });
    
    if (!cart) {
      // Create new cart if doesn't exist
      cart = await Cart.create({ userId: user._id, items: [] });
    }

    return NextResponse.json({ cart }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch cart' },
      { status: 500 }
    );
  }
}

// POST - Add item to cart
export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    console.log("event from cart post api reached")
    const body = await request.json();
    const { walletAddress, productId, productUrl, productName, productImage, quantity, priceUSD } = body;

    console.log("Payload received api:", body);
    if (!walletAddress || !productId || !quantity || !priceUSD) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const user = await User.findOne({ walletAddress: walletAddress.toLowerCase() });
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    let cart = await Cart.findOne({ userId: user._id, status: 'active' });
    
    if (!cart) {
      cart = new Cart({ userId: user._id, items: [] });
    }

    // Check if product already exists in cart
    const existingItemIndex = cart.items.findIndex(
      (item) => item.productId === productId
    );

    if (existingItemIndex > -1) {
      // Update quantity
      cart.items[existingItemIndex].quantity += quantity;
    } else {
      // Add new item
      cart.items.push({
        productId,
        productUrl,
        productName,
        productImage,
        quantity,
        priceUSD,
        addedAt: new Date(),
      });
    }
    console.log("Cart before saving:", cart);

    await cart.save();

    return NextResponse.json({ cart }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to add item to cart' },
      { status: 500 }
    );
  }
}
