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


type CartItem = Product & {
  quantity: number;
};

export async function createOrder(
  cart: CartItem[],
  checkoutData: {
    city: string;
    recipient: string;
    phone: string;
    deliveryDate: string;
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

              quantity:
                item.quantity,
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
              checkoutData.deliveryDate,
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

export async function trackOrder(
  orderId: string
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

  await client.connect(
    transport
  );

  const result =
    await client.callTool({
      name:
        "kapruka_track_order",

      arguments: {
        params: {
          order_number:
            orderId,
        },
      },
    });

  return result;
}


export async function listCategories() {
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

  await client.connect(
    transport
  );

  const result =
    await client.callTool({
      name:
        "kapruka_list_categories",

      arguments: {
        params: {
          depth: 1,
        },
      },
    });

  console.log(
    "RAW CATEGORIES:",
    JSON.stringify(
      result,
      null,
      2
    )
  );

  return result;
}