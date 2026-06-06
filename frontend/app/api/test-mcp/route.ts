import { NextResponse } from "next/server";
import { searchProducts } from "@/services/mcp/kapruka";

export async function GET() {
  try {
    const products = await searchProducts("car");

    return NextResponse.json({
      success: true,
      products,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        error: String(error),
      },
      {
        status: 500,
      }
    );
  }
}