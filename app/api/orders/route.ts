import { NextRequest, NextResponse } from 'next/server';
import Order from '@/lib/mongodb/schema/OrderSchema';
import dbConnect from '@/lib/mongodb/mongodbConfig';
import Cart from '@/lib/mongodb/schema/CartSchema';
import User from '@/lib/mongodb/schema/UserSchema';

// GET - Get all orders for a user
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

    const orders = await Order.find({ userId: user._id }).sort({ createdAt: -1 });

    return NextResponse.json({ orders }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}

// POST - Create order after payment
export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    
    const body = await request.json();
    const { walletAddress, txHash, chain, shippingAddress } = body;

    if (!walletAddress || !txHash || !chain) {
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

    // Get checked out cart
    const cart = await Cart.findOne({ userId: user._id, status: 'checkedOut' });
    if (!cart) {
      return NextResponse.json(
        { error: 'No checked out cart found' },
        { status: 404 }
      );
    }

    // Create order from cart
    const order = await Order.create({
      userId: user._id,
      products: cart.items.map(item => ({
        productId: item.productId,
        productUrl: item.productUrl,
        productName: item.productName,
        productImage: item.productImage,
        quantity: item.quantity,
        priceUSD: item.priceUSD,
      })),
      totalPriceUSD: cart.totalPriceUSD,
      shippingAddress: shippingAddress || user.shippingAddress,
      payment: {
        txHash,
        chain,
        status: 'pending',
      },
      status: 'created',
    });

    // Clear the cart by deleting it
    await Cart.findByIdAndDelete(cart._id);

    return NextResponse.json({ 
      message: 'Order created successfully',
      order 
    }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    );
  }
}