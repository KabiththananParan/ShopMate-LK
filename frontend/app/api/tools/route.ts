import { NextResponse } from "next/server";

import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";

export async function GET() {
  const client = new Client({
    name: "shopmate-lk",
    version: "1.0.0",
  });

  const transport = new StreamableHTTPClientTransport(
    new URL("https://mcp.kapruka.com/mcp")
  );

  await client.connect(transport);

  const tools = await client.listTools();

  return NextResponse.json(tools);
}