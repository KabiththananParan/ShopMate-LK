import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";

import { Product } from "@/types/product";
import { mapSearchResults } from "./searchMapper";
import { mapKaprukaProduct } from "./productMapper";

export async function searchProducts(
  query: string
): Promise<Product[]> {
  const client = new Client({
    name: "shopmate-lk",
    version: "1.0.0",
  });

  const transport = new StreamableHTTPClientTransport(
    new URL("https://mcp.kapruka.com/mcp")
  );

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

  const rawText =
    (result.structuredContent as { result?: string })?.result ?? "";

  const products = mapSearchResults(rawText);

  return await Promise.all(
    products.slice(0, 3).map((product) =>
      getProduct(product.id)
    )
  );
}

export async function getProduct(
  productId: string
): Promise<Product> {
  const client = new Client({
    name: "shopmate-lk",
    version: "1.0.0",
  });

  const transport = new StreamableHTTPClientTransport(
    new URL("https://mcp.kapruka.com/mcp")
  );

  await client.connect(transport);

  const result = await client.callTool({
    name: "kapruka_get_product",
    arguments: {
      params: {
        product_id: productId,
        currency: "LKR",
      },
    },
  });

  const rawText =
    (result.structuredContent as { result?: string })?.result ?? "";

  return mapKaprukaProduct(rawText);
}

export async function checkDelivery() {
  // TODO
}

export async function createOrder() {
  // TODO
}

export async function trackOrder() {
  // TODO
}