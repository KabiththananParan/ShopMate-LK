import { NextResponse } from "next/server";
import { checkDelivery } from "@/services/mcp/kapruka";

export async function GET() {
  const cities = [
    "Colombo",
    "Colombo 01",
    "Colombo 03",
    "Colombo 07",
    "Dehiwala",
    "Mount Lavinia",
    "Nugegoda",
  ];

  const results = [];

  for (const city of cities) {
    try {
      const result = await checkDelivery(city);

      results.push({
        city,
        result: result.structuredContent,
      });
    } catch (e) {
      results.push({
        city,
        error: String(e),
      });
    }
  }

  return NextResponse.json(results);
}