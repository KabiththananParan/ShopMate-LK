import { NextResponse } from "next/server";
import { getProduct } from "@/services/mcp/kapruka";

export async function GET() {
  const product = await getProduct("KIDSTOY0Z1649");

  return NextResponse.json(product);
}