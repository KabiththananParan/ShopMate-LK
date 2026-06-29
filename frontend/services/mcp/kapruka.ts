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

export async function checkDelivery(
  city: string,
  productId?: string,
  deliveryDate?: string
) {
  const client = new Client({
    name: "shopmate-lk",
    version: "1.0.0",
  });

  const transport = new StreamableHTTPClientTransport(
    new URL("https://mcp.kapruka.com/mcp")
  );

  await client.connect(transport);

  const result = await client.callTool({
    name: "kapruka_check_delivery",
    arguments: {
      params: {
        city,
        delivery_date: deliveryDate,
        product_id: productId,
      },
    },
  });

  console.log(result);

  return result;
}

export async function createOrder(
    cart: Product[],
    checkoutData: {
        city: string;
        recipient: string;
        phone: string;
        address: string;
        sender: string;
    }
) {
    const client = new Client({
        name: "shopmate-lk",
        version: "1.0.0",
    });

    const transport =
        new StreamableHTTPClientTransport(
            new URL(
                "https://mcp.kapruka.com/mcp"
            )
        );

    await client.connect(transport);

    const result =
        await client.callTool({
            name: "kapruka_create_order",

            arguments: {
                params: {
                    cart: cart.map(
                        (item) => ({
                            product_id:
                                item.id,
                            quantity: 1,
                        })
                    ),

                    recipient: {
                        name:
                            checkoutData.recipient,
                        phone:
                            checkoutData.phone,
                    },

                    delivery: {
                        address:
                            checkoutData.address,
                        city:
                            checkoutData.city,

                        date:
                            new Date()
                                .toISOString()
                                .split("T")[0],
                    },

                    sender: {
                        name:
                            checkoutData.sender,
                        anonymous: false,
                    },

                    currency: "LKR",
                },
            },
        });

    console.log(
        "ORDER RESULT:",
        result
    );

    return result;
}

export async function trackOrder() {
  // TODO
}