import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb/mongodbConfig';
import User from '@/lib/mongodb/schema/UserSchema';

// GET - Get user by wallet address
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

    return NextResponse.json({ user }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch user' },
      { status: 500 }
    );
  }
}

// POST - Create or update user
export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    
    const body = await request.json();
    const { walletAddress, email, name, shippingAddress } = body;

    if (!walletAddress) {
      return NextResponse.json(
        { error: 'Wallet address is required' },
        { status: 400 }
      );
    }

const user = await User.findOneAndUpdate(
  { walletAddress: walletAddress.toLowerCase() },
  { email, name, shippingAddress }, // shippingAddress object replaces the previous one
  { new: true, upsert: true }
);
    return NextResponse.json({ user }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create/update user' },
      { status: 500 }
    );
  }
}
