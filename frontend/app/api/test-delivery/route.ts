import { NextResponse } from "next/server";
import { checkDelivery } from "@/services/mcp/kapruka";

export async function GET() {
  const result = await checkDelivery(
    "Jaffna",
    "cake00KA001679"
  );

  return NextResponse.json(result);
}