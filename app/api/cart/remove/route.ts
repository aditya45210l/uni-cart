import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb/mongodbConfig';
import Cart from '@/lib/mongodb/schema/CartSchema';
import User from '@/lib/mongodb/schema/UserSchema';

export async function DELETE(request: NextRequest) {
  try {
    await dbConnect();
    
    const searchParams = request.nextUrl.searchParams;
    const walletAddress = searchParams.get('walletAddress');
    const productId = searchParams.get('productId');

    if (!walletAddress || !productId) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
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

    cart.items = cart.items.filter((item) => item.productId !== productId);
    await cart.save();

    return NextResponse.json({ cart }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to remove item from cart' },
      { status: 500 }
    );
  }
}
