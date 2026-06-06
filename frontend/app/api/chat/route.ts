import { NextResponse } from "next/server";
import { searchProducts } from "@/services/mcp/kapruka";

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    if (!message || typeof message !== "string") {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    const products = await searchProducts(message);

    return NextResponse.json({
      reply: `Found ${products.length} products for "${message}"`,
      products,
    });
  } catch (error) {
    console.error("Chat API Error:", error);

    return NextResponse.json(
      {
        error: "Failed to process request",
      },
      {
        status: 500,
      }
    );
  }
}