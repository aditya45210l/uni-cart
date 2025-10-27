import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb/mongodbConfig';
import Cart from '@/lib/mongodb/schema/CartSchema';
import User from '@/lib/mongodb/schema/UserSchema';

export async function PUT(request: NextRequest) {
  try {
    await dbConnect();
    
    const body = await request.json();
    const { walletAddress, productId, quantity } = body;

    if (!walletAddress || !productId) {
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

    const cart = await Cart.findOne({ userId: user._id, status: 'active' });
    if (!cart) {
      return NextResponse.json(
        { error: 'Cart not found' },
        { status: 404 }
      );
    }

    const itemIndex = cart.items.findIndex((item) => item.productId === productId);
    
    if (itemIndex === -1) {
      return NextResponse.json(
        { error: 'Product not found in cart' },
        { status: 404 }
      );
    }

    if (quantity <= 0) {
      // Remove item if quantity is 0 or negative
      cart.items.splice(itemIndex, 1);
    } else {
      cart.items[itemIndex].quantity = quantity;
    }

    await cart.save();

    return NextResponse.json({ cart }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update cart item' },
      { status: 500 }
    );
  }
}
