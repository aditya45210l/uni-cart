import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb/mongodbConfig';
import Cart from '@/lib/mongodb/schema/CartSchema';
import User from '@/lib/mongodb/schema/UserSchema';

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    
    const body = await request.json();
    const { walletAddress } = body;

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

    const cart = await Cart.findOne({ userId: user._id, status: 'active' });
    if (!cart || cart.items.length === 0) {
      return NextResponse.json(
        { error: 'Cart is empty' },
        { status: 400 }
      );
    }

    // Mark cart as checked out
    cart.status = 'checkedOut';
    await cart.save();

    return NextResponse.json({ 
      message: 'Cart checked out successfully',
      cart 
    }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to checkout' },
      { status: 500 }
    );
  }
}