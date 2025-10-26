import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = await params;
  const apiKey = process.env.NEXT_PUBLIC_API_KEY; // your key in .env
  const url = `https://api.zinc.io/v1/products/${id}?retailer=amazon`;

  try {
    const response = await axios.get(url, {
      auth: {
        username: apiKey!,
        password: "",
      },
    });
    console.log("Fetched product data:", response.data);
    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error("Error fetching product:", error.response?.data || error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
