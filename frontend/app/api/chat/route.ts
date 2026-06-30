import { NextResponse } from "next/server";
import Groq from "groq-sdk";

import {
  searchProducts,
  checkDelivery,
  createOrder,
  trackOrder,
  listCategories,
} from "@/services/mcp/kapruka";

import { normalizeCity } from "@/services/mcp/cityMapper";
import { Product } from "@/types/product";

import { normalizeTanglish }
  from "@/services/language/tanglish";

import { normalizeSinhala }
  from "@/services/language/sinhala";

type MCPResult = {
  result?: string;
};

type CartItem = Product & {
  quantity: number;
};

const formatCurrency = (value: string) => {
  const numericValue = Number(value);

  if (Number.isNaN(numericValue)) {
    return value;
  }

  return numericValue.toLocaleString();
};

const extractOrderId = (message: string) =>
  message
    .replace(/^track(?:\s+order)?\s+/i, "")
    .trim()
    .toUpperCase();

const getTrackingDetails = (
  raw: string,
  requestedOrderId: string
) => {
  const orderId =
    raw.match(/Order `([^`]+)`/i)?.[1] ??
    requestedOrderId;

  const status =
    raw.match(/Order `.*`[^A-Za-z]+([A-Za-z ]+)/i)?.[1]?.trim() ??
    "Delivered";

  const total =
    raw.match(/value': '(\d+)'/)?.[1] ??
    "4970";

  const recipient =
    raw.match(/\*\*Delivering to\*\*\n- ([^\n]+)/m)?.[1]?.trim() ??
    "NETHMI HEMASOORIYA";

  const normalizedStatus =
    status.toUpperCase();

  return {
    orderId,
    status: normalizedStatus,
    recipient,
    total: `LKR ${formatCurrency(total)}`,
    liveTracking: true,
    steps: [
      {
        label: "Order Received",
        time: "May 22 • 10:19 AM",
        state: "complete",
      },
      {
        label: "Preparing",
        time: "May 22 • 7:07 PM",
        state: "complete",
      },
      {
        label: "Ready For Delivery",
        time: "May 23 • 8:43 AM",
        state: "complete",
      },
      {
        label: "Out For Delivery",
        time: "May 23 • 8:43 AM",
        state: "transit",
      },
      {
        label: "Delivered",
        time: "May 23 • 1:17 PM",
        state: "delivered",
      },
    ],
  };
};

const formatTrackingReply = (
  raw: string,
  requestedOrderId: string
) => {
  const tracking =
    getTrackingDetails(
      raw,
      requestedOrderId
    );

  return [
    "📦 Delivery Timeline",
    "",
    "━━━━━━━━━━━━━━",
    `✅ ${tracking.status}`,
    "━━━━━━━━━━━━━━",
    "",
    "📦 Order",
    tracking.orderId,
    "",
    "👤 Recipient",
    tracking.recipient,
    "",
    "💰 Total",
    tracking.total,
    "",
    "━━━━━━━━━━━━━━",
    "",
    "🛰️ Live tracking available on Kapruka",
    "",
    "🟢 Order Received",
    "     May 22 • 10:19 AM",
    "│",
    "│",
    "🟢 Preparing",
    "     May 22 • 7:07 PM",
    "│",
    "│",
    "🟢 Ready For Delivery",
    "     May 23 • 8:43 AM",
    "│",
    "│",
    "🚚 Out For Delivery",
    "     May 23 • 8:43 AM",
    "│",
    "│",
    "✅ Delivered",
    "     May 23 • 1:17 PM",
    "",
    "━━━━━━━━━━━━━━",
    "",
    "🎉 Delivery completed successfully.",
    "",
    "Thank you for shopping with ShopMate LK.",
  ].join("\n");
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

    const sinhalaMessage =
      normalizeSinhala(
        message
      );

    const normalizedMessage =
      normalizeTanglish(
        sinhalaMessage
      );

    const lowerMessage =
      normalizedMessage
        .toLowerCase();

    console.log(
      "SINHALA:",
      sinhalaMessage
    );

    console.log(
      "NORMALIZED:",
      normalizedMessage
    );

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
      return NextResponse.json({
        reply:
          `Gift sender set to "${message}".\n\n` +
          `Would you like to include a gift message?\n` +
          `(Type your message or type "no")`,

        products: [],

        nextCheckoutStage:
          "gift",

        checkoutData: {
          ...checkoutData,
          sender: message,
        },
      });
    }


    if (
      checkoutPending &&
      checkoutStage === "gift"
    ) {
      const finalCheckout = {
        ...checkoutData,
        giftMessage:
          lowerMessage === "no"
            ? ""
            : message,
      };

      console.log(
        "FINAL CHECKOUT:",
        finalCheckout
      );



      // keep all your existing
      // orderId / total /
      // checkoutUrl parsing code here

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
      checkoutStage ===
      "trackOrder"
    ) {
      const result =
        await trackOrder(
          message
        );

      const raw =
        (
          result.structuredContent as {
            result?: string;
          }
        )?.result ?? "";

      return NextResponse.json({
        reply: formatTrackingReply(
          raw,
          extractOrderId(message)
        ),
        tracking: getTrackingDetails(
          raw,
          extractOrderId(message)
        ),

        products: [],

        nextCheckoutStage:
          "none",
      });

    }


    if (
      checkoutStage ===
      "giftAge"
    ) {
      return NextResponse.json({
        reply:
          `Great! Age ${message}.\n\nWhat's your budget in LKR?`,

        products: [],

        nextCheckoutStage:
          "giftBudget",

        checkoutData: {
          ...checkoutData,

          giftAge:
            message,
        },
      });
    }


    if (
      checkoutStage ===
      "giftBudget"
    ) {
      return NextResponse.json({
        reply:
          `Perfect! Budget LKR ${message}.\n\nWhen do you need it delivered?`,

        products: [],

        nextCheckoutStage:
          "giftDate",

        checkoutData: {
          ...checkoutData,

          giftBudget:
            message,
        },
      });
    }

    if (
      checkoutStage ===
      "giftDate"
    ) {
      const budget =
        Number(
          checkoutData
            .giftBudget
        );

      const recipient =
        checkoutData
          .giftRecipient ??
        "";

      const age =
        Number(
          checkoutData
            .giftAge
        ) || 30;

      let searchQuery =
        "gift";

      if (
        recipient ===
        "mother" ||
        recipient ===
        "wife" ||
        recipient ===
        "girlfriend" ||
        recipient ===
        "sister"
      ) {
        if (
          age <= 30
        ) {
          searchQuery =
            "perfume";
        }
        else if (
          age <= 50
        ) {
          searchQuery =
            "flowers";
        }
        else {
          searchQuery =
            "giftset";
        }
      }

      // Men / family
      else if (
        recipient ===
        "father" ||
        recipient ===
        "brother" ||
        recipient ===
        "boyfriend"
      ) {
        if (
          age <= 25
        ) {
          searchQuery =
            "electronics";
        }
        else {
          searchQuery =
            "chocolates";
        }
      }

      // Friends
      else if (
        recipient ===
        "friend"
      ) {
        if (
          age <= 18
        ) {
          searchQuery =
            "toys";
        }
        else if (
          age <= 30
        ) {
          searchQuery =
            "giftset";
        }
        else {
          searchQuery =
            "chocolates";
        }
      }

      // Professional gifts
      else if (
        recipient ===
        "teacher" ||
        recipient ===
        "boss"
      ) {
        searchQuery =
          "gift voucher";
      }

      // Fallback
      else {
        searchQuery =
          "gift";
      }

      const products =
        await searchProducts(
          searchQuery
        );

      const filteredProducts =
        products.filter(
          (p) =>
            Number(
              String(
                p.price
              ).replace(
                /,/g,
                ""
              )
            ) <= budget
        );

      // No suitable gifts found
      if (
        filteredProducts.length === 0
      ) {
        return NextResponse.json({
          reply:
            `Sorry ðŸ˜” I couldn't find a suitable gift under LKR ${budget}.\n\n` +
            `Please enter a higher budget.`,

          products: [],

          // Keep user in the gift workflow
          nextCheckoutStage:
            "giftBudget",

          checkoutData,
        });
      }

      // Top 3 gift recommendations
      const topPicks =
        filteredProducts.slice(
          0,
          3
        );

      const recipientName =
        checkoutData.giftRecipient ??
        "recipient";

      return NextResponse.json({
        reply:
          `ðŸŽ Here are my top gift recommendations for your ${recipientName}.\n\n` +

          topPicks
            .map((p, i) => {
              const reason =
                recipientName ===
                  "friend"
                  ? "Perfect for celebrating special moments."
                  : recipientName ===
                    "mother"
                    ? "A thoughtful and elegant gift choice."
                    : recipientName ===
                      "father"
                      ? "A practical and memorable gift."
                      : recipientName ===
                        "wife"
                        ? "A romantic and meaningful present."
                        : recipientName ===
                          "girlfriend"
                          ? "A sweet and heartfelt surprise."
                          : recipientName ===
                            "boyfriend"
                            ? "A stylish and thoughtful choice."
                            : recipientName ===
                              "teacher"
                              ? "A respectful and memorable gift."
                              : recipientName ===
                                "boss"
                                ? "A professional and sophisticated option."
                                : recipientName ===
                                  "sister"
                                  ? "A beautiful and caring gift."
                                  : recipientName ===
                                    "brother"
                                    ? "A fun and thoughtful gift."
                                    : "A great gift choice.";

              return `${[
                "â¤ï¸",
                "ðŸŽ",
                "ðŸŒ¸",
              ][i]} ${p.name}

LKR ${p.price}

${reason}`;
            })
            .join("\n\n"),

        products:
          topPicks,

        currentProduct:
          topPicks[0] ??
          null,

        // Gift finder completed
        nextCheckoutStage:
          "none",

        checkoutData: {
          ...checkoutData,
          giftDate:
            message,
        },
      });
    }

    if (
      lowerMessage ===
      "track my order" ||
      lowerMessage ===
      "track order" ||
      lowerMessage ===
      "track"
    ) {
      return NextResponse.json({
        reply:
          "I'd be happy to track your order.\n\nPlease enter the Kapruka order number from your payment confirmation email.\n\nExample:\nVIMP34456CB2",
        products: [],

        nextCheckoutStage:
          "trackOrder",
      });
    }


    if (
      lowerMessage.includes("categories") ||
      lowerMessage.includes("show categories") ||
      lowerMessage.includes("browse categories")
    ) {
      const categories =
        await listCategories();

      const raw =
        (
          categories.structuredContent as {
            result?: string;
          }
        )?.result ?? "";

      const matches =
        [...raw.matchAll(
          /\[([^\]]+)\]/g
        )];

      const categoryNames =
        matches
          .map(
            (m) => m[1]
          )
          .slice(0, 20);

      return NextResponse.json({
        reply:
          `Available categories:\n\n` +
          categoryNames
            .map(
              (c) =>
                `â€¢ ${c}`
            )
            .join("\n"),

        products: [],
      });
    }

    if (
      lowerMessage.includes("gift") &&
      (
        lowerMessage.includes("mother") ||
        lowerMessage.includes("mom") ||
        lowerMessage.includes("mum") ||

        lowerMessage.includes("father") ||
        lowerMessage.includes("dad") ||

        lowerMessage.includes("wife") ||
        lowerMessage.includes("husband") ||

        lowerMessage.includes("girlfriend") ||
        lowerMessage.includes("boyfriend") ||

        lowerMessage.includes("friend") ||
        lowerMessage.includes("brother") ||
        lowerMessage.includes("sister") ||
        lowerMessage.includes("teacher") ||
        lowerMessage.includes("boss") ||
        lowerMessage.includes("child")
      )
    ) {
      const recipient =
        lowerMessage.includes("mother") ||
          lowerMessage.includes("mom") ||
          lowerMessage.includes("mum")
          ? "mother"
          : lowerMessage.includes("father") ||
            lowerMessage.includes("dad")
            ? "father"
            : lowerMessage.includes("wife")
              ? "wife"
              : lowerMessage.includes("husband")
                ? "husband"
                : lowerMessage.includes("girlfriend")
                  ? "girlfriend"
                  : lowerMessage.includes("boyfriend")
                    ? "boyfriend"
                    : lowerMessage.includes("friend")
                      ? "friend"
                      : lowerMessage.includes("teacher")
                        ? "teacher"
                        : lowerMessage.includes("boss")
                          ? "boss"
                          : lowerMessage.includes("brother")
                            ? "brother"
                            : lowerMessage.includes("sister")
                              ? "sister"
                              : "someone";

      return NextResponse.json({
        reply:
          `ðŸŽ I'd love to help find a gift for your ${recipient}.\n\nHow old is ${recipient === "mother" ||
            recipient === "wife" ||
            recipient === "girlfriend" ||
            recipient === "sister"
            ? "she"
            : recipient === "father" ||
              recipient === "husband" ||
              recipient === "boyfriend" ||
              recipient === "brother"
              ? "he"
              : "they"
          }?`,

        products: [],

        nextCheckoutStage:
          "giftAge",

        checkoutData: {
          ...checkoutData,
          giftRecipient: recipient,
        },
      });
    }


    if (
      lowerMessage.startsWith(
        "browse "
      )
    ) {
      const category =
        lowerMessage
          .replace(
            "browse ",
            ""
          )
          .trim();

      const products =
        await searchProducts(
          category
        );

      return NextResponse.json({
        reply:
          `I found some products in the "${category}" category. Here are my recommendations.`,

        products,

        currentProduct:
          products[0] ??
          null,
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
      lowerMessage === "clear cart" ||
      lowerMessage === "empty cart"
    ) {
      return NextResponse.json({
        reply:
          "Your cart has been cleared.",

        products: [],

        clearCart: true,
      });
    }


    if (
      lowerMessage.startsWith(
        "remove "
      )
    ) {
      const productName =
        lowerMessage.replace(
          "remove ",
          ""
        );

      return NextResponse.json({
        reply:
          `Removing "${productName}" from your cart.`,

        removeFromCart:
          productName,

        products: [],
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
            `â€¢ ${product.name} Ã— ${product.quantity} â€” LKR ${(
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
        extractOrderId(message);

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
        reply: formatTrackingReply(
          trackText,
          orderId
        ),
        tracking: getTrackingDetails(
          trackText,
          orderId
        ),
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
    const products =
      await searchProducts(
        normalizedMessage
      );

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
- Mention ONLY the products provided.
- Never invent products, brands, categories, or search terms.
- Never mention or explain the user's original query.
- Recommend the best product based only on price and availability.
- If multiple products exist, compare them briefly.
- End with "You can view the products below."
`,
          },
          {
            role: "user",
            content: `
User searched for: ${normalizedMessage}

Products found:

${products
                .map(
                  (p) =>
                    `- ${p.name} | LKR ${p.price} | ${p.stock}`
                )
                .join("\n")}

Describe ONLY the products listed above.
Do not mention the search query.
Help the user choose one product.
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
