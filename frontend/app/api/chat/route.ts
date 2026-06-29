import { NextResponse } from "next/server";
import Groq from "groq-sdk";

import {
  searchProducts,
  checkDelivery,
  createOrder,
  trackOrder,
} from "@/services/mcp/kapruka";

import { normalizeCity } from "@/services/mcp/cityMapper";
import { Product } from "@/types/product";

type MCPResult = {
    result?: string;
};

type CartItem = Product & {
    quantity: number;
};

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(req: Request) {
  try {
    const {
        message,
        lastProduct,
        cart = [],
        checkoutPending = false,
        checkoutStage = "none",
        checkoutData = {},
    } = await req.json();

    if (!message || typeof message !== "string") {
      return NextResponse.json(
        {
          error: "Message is required",
        },
        {
          status: 400,
        }
      );
    }

    const lowerMessage = message.toLowerCase();

if (
    checkoutPending &&
    checkoutStage === "confirm" &&
    (
        lowerMessage === "yes" ||
        lowerMessage === "y"
    )
) {
    return NextResponse.json({
        reply:
            "Great! Checkout confirmed.\n\nPlease provide the delivery city (for example: Colombo 03, Jaffna, Kandy).",

        products: [],

        nextCheckoutStage: "city",
    });
}

if (
    checkoutPending &&
    checkoutStage === "city"
) {
    return NextResponse.json({
        reply:
            `Delivery city set to "${message}".\n\nPlease provide the recipient's full name.`,

        products: [],

        nextCheckoutStage:
            "recipient",

        checkoutData: {
            ...checkoutData,
            city: message,
        },
    });
}

if (
    checkoutPending &&
    checkoutStage === "recipient"
) {
    return NextResponse.json({
        reply:
            `Recipient name set to "${message}".\n\nPlease provide the recipient's phone number.`,

        products: [],

        nextCheckoutStage:
            "phone",

        checkoutData: {
          ...checkoutData,
            recipient: message,
        },
    });
}




if (
    checkoutPending &&
    checkoutStage === "phone"
) {
    return NextResponse.json({
        reply:
            `Phone number saved.\n\nWhen would you like the delivery? (Example: 2026-07-01)`,

        products: [],

        nextCheckoutStage:
            "deliveryDate",

        checkoutData: {
            ...checkoutData,
            phone: message,
        },
    });
}

if (
    checkoutPending &&
    checkoutStage === "deliveryDate"
) {
    return NextResponse.json({
        reply:
            `Delivery date set to "${message}".\n\nPlease provide the delivery address.`,

        products: [],

        nextCheckoutStage:
            "address",

        checkoutData: {
            ...checkoutData,
            deliveryDate: message,
        },
    });
}



if (
    checkoutPending &&
    checkoutStage === "address"
) {
    return NextResponse.json({
        reply:
            `Delivery address saved.\n\nPlease provide the sender's name.`,

        products: [],

        nextCheckoutStage:
            "sender",

        checkoutData: {
            ...checkoutData,
            address: message,
        },
    });
}


if (
    checkoutPending &&
    checkoutStage === "sender"
) {
    const finalCheckout = {
        ...checkoutData,
        sender: message,
    };

    console.log(
        "FINAL CHECKOUT:",
        finalCheckout
    );

    const order = await createOrder(
        cart,
        finalCheckout
    );

    const orderText =
    (
        order.structuredContent as MCPResult
    )?.result ?? "";

    const orderId =
        orderText.match(
            /ORD-\d+-[A-Z0-9]+/
        )?.[0] ?? "";

    const total =
        orderText.match(
            /Grand total:\*\* LKR ([\d,]+)/
        )?.[1] ?? "";

    const checkoutUrl =
        orderText.match(
            /https:\/\/[^\s)]+/
        )?.[0] ?? "";

    console.log(
        "ORDER:",
        JSON.stringify(
            order,
            null,
            2
        )
    );

    return NextResponse.json({
        reply:
            `Order created successfully!\n\n` +
            `Order: ${orderId}\n` +
            `Total: LKR ${total}\n\n` +
            `Click the payment link below.`,

        products: [],

        nextCheckoutStage:
            "complete",

        checkoutData:
            finalCheckout,

        order: {
            id: orderId,
            total,
            checkoutUrl,
        },
    });

}




    if (checkoutPending && checkoutStage === "none") {
    const total = cart.reduce(
        (
            sum: number,
            product: CartItem
        ) =>
            sum +
            product.price *
            product.quantity,
        0
    );

    return NextResponse.json({
        reply:
            `You have ${cart.length} item(s) worth ` +
            `LKR ${total.toLocaleString()}.\n\n` +
            `Proceed with checkout? Reply "yes" to continue.`,
        products: cart,
    });
}


    if (
            lowerMessage === "checkout" ||
            lowerMessage.includes("checkout")
        ) {
            if (cart.length === 0) {
                return NextResponse.json({
                    reply: "Your cart is empty. Add some products before checking out.",
                    products: [],
                });
            }

            const total = cart.reduce(
                (
                    sum: number,
                    product: CartItem
                ) =>
                    sum +
                    product.price *
                    product.quantity,
                0
            );

            return NextResponse.json({
                reply: `You have ${cart.length} item(s) worth LKR ${total.toLocaleString()}.\n\nWould you like to proceed to checkout?`,
                products: cart,
            });
        }


    if (
        lowerMessage === "cart" ||
        lowerMessage.includes("show my cart") ||
        lowerMessage.includes("my cart")
    ) {
        if (cart.length === 0) {
            return NextResponse.json({
                reply: "Your cart is empty.",
                products: [],
            });
        }

        const total = cart.reduce(
              (
                  sum: number,
                  product: CartItem
              ) =>
                  sum +
                  product.price *
                  product.quantity,
              0
          );


          const items = cart
              .map(
                  (product: CartItem) =>
                      `• ${product.name} × ${product.quantity} — LKR ${(
                          product.price *
                          product.quantity
                      ).toLocaleString()}`
              )
              .join("\n");

        return NextResponse.json({
            reply: [
                      `You have ${cart.length} item(s) in your cart:`,
                      "",
                      items,
                      "",
                      `Total: LKR ${total.toLocaleString()}`,
                  ].join("\n"),
            products: cart,
        });
    }



    if (
          lowerMessage.startsWith("track ")
      ) {
          const orderId =
              message
                  .replace(
                      /^track\s+/i,
                      ""
                  )
                  .trim();

          const result =
              await trackOrder(
                  orderId
              );

          console.log(
              "TRACK RESULT:",
              result
          );

          const trackText =
              (
                  result.structuredContent as {
                      result?: string;
                  }
              )?.result ??
              "Unable to track order.";

          if (
              trackText.includes(
                  "order_not_found"
              )
          ) {
              return NextResponse.json({
                  reply:
                      "The order has not yet entered the tracking system. Please complete payment first or try again later.",

                  products: [],
              });
          }

          return NextResponse.json({
              reply: trackText,
              products: [],
          });
      }

      


    // STEP 8: DELIVERY CHECK
    if (
      lowerMessage.includes("deliver") ||
      lowerMessage.includes("delivery")
    ) {
      
      const cityMatch = message.match(
        /(?:to|in)\s+([A-Za-z\s]+)/i
      );

      const city = normalizeCity(
          cityMatch?.[1]?.trim() ?? "Colombo"
        );

      const delivery =
          await checkDelivery(
              city,
              lastProduct?.id
          );

      return NextResponse.json({
        reply:
          (delivery.structuredContent as { result?: string })
            ?.result ??
          "Delivery information unavailable.",
        products: [],
      });
    }

    // NORMAL PRODUCT SEARCH
    const products = await searchProducts(message);

    const chatCompletion =
      await groq.chat.completions.create({
        model: "llama-3.1-8b-instant",
        messages: [
          {
            role: "system",
            content: `
You are ShopMate LK, a Sri Lankan AI shopping assistant.

Rules:
- Keep responses under 80 words.
- Mention only products provided.
- Never invent products.
- Give a brief recommendation.
- End with "You can view the products below."
`,
          },
          {
            role: "user",
            content: `
User searched for: ${message}

Products found:

${products
  .map(
    (p) =>
      `- ${p.name} | LKR ${p.price} | ${p.stock}`
  )
  .join("\n")}

Explain these products briefly and help the user choose.
`,
          },
        ],
      });

    const reply =
      chatCompletion.choices[0]?.message
        ?.content ??
      "I found some products for you.";

    return NextResponse.json({
      reply,
      products,
      currentProduct:
        products.length > 0
          ? products[0]
          : null,
    });
  } catch (error) {
    console.error(
      "Chat API Error:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Failed to process request",
      },
      {
        status: 500,
      }
    );
  }
}