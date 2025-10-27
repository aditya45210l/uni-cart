import { NextRequest, NextResponse } from 'next/server';
import Order from '@/lib/mongodb/schema/OrderSchema';
import dbConnect from '@/lib/mongodb/mongodbConfig';


export async function PUT(request: NextRequest) {
  try {
    await dbConnect();
    
    const body = await request.json();
    const { orderId, status, paymentStatus, refundTx } = body;

    if (!orderId || !status) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const updateData: any = { status };
    
    if (paymentStatus) {
      updateData['payment.status'] = paymentStatus;
    }
    
    if (refundTx) {
      updateData.refundTx = refundTx;
    }

    const order = await Order.findByIdAndUpdate(
      orderId,
      updateData,
      { new: true }
    );

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ order }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update order status' },
      { status: 500 }
    );
  }
}