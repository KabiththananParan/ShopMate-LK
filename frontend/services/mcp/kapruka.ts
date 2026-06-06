import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";

import { Product } from "@/types/product";

const client = new Client({
    name: "shopmate-lk",
    version: "1.0.0",
});

const transport = new StreamableHTTPClientTransport(
    new URL("https://mcp.kapruka.com/mcp")
);

export async function searchProducts(query: string): Promise<Product[]> {
    await client.connect(transport);

    const result = await client.callTool({
        name: "kapruka_search_products",
        arguments: {
            params: {
                q: query,
                limit: 5,
                currency: "LKR",
            },
        },
    });

    const rawText = result.structuredContent?.result ?? "";

    console.log(result);

    return [];
}


function getProduct() {

}

function checkDelivery() {

}

function createOrder() {

}

function trackOrder() {

}