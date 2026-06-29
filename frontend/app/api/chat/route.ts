import { NextResponse } from "next/server";
import Groq from "groq-sdk";

import {
  searchProducts,
  checkDelivery,
} from "@/services/mcp/kapruka";

import { normalizeCity } from "@/services/mcp/cityMapper";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(req: Request) {
  try {
    const {
            message,
            lastProduct,
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