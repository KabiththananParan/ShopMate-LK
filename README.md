# ShopMate LK

AI-powered shopping assistant for Sri Lankan e-commerce.

ShopMate LK turns product discovery, gift selection, cart building, checkout, and payment handoff into a conversational experience. Users can search naturally in English, Tanglish-style Sinhala, Sinhala-normalized phrases, or voice input, then browse rich product cards powered by Kapruka MCP data.

## Highlights

- Conversational product discovery with Groq Llama 3.1.
- Live Kapruka MCP integration for product search, product details, delivery checks, order creation, order tracking, and categories.
- Rich product results with images, recommendation cards, carousel-style browsing, stock, price, rationale, Details, and Add To Bag actions.
- Persistent cart with quantity support using browser localStorage.
- Guided checkout flow with progress indicator.
- Gift recommendation flow for recipients such as mother, father, friend, sibling, teacher, and partner.
- Order success card with order id, total, and Pay Now link.
- Voice input using the browser Web Speech API.
- Demo-ready opening suggestions and animated loading/listening states.

## Demo Prompts

Try these on the first screen:

```text
mama cake ekak ganna oni
Birthday gift for my mother
browse flowers
Find me a chocolate hamper under LKR 10000
```

Other useful prompts:

```text
Show me birthday cakes in Colombo
Show categories
Do you deliver to Jaffna?
cart
checkout
track ORD-20260630-ABCD
clear cart
remove blueberry cake
```

## User Flow

```text
Open ShopMate LK
  -> Ask for a product, gift, category, or delivery help
  -> Review rich product cards
  -> Add items to bag
  -> Type "cart" to review
  -> Type "checkout"
  -> Confirm checkout
  -> Enter city, recipient, phone, date, address, sender, gift message
  -> Receive order id, total, and payment link
```

## Checkout Steps

The checkout progress indicator follows this flow:

```text
Confirm -> City -> Recipient -> Phone -> Date -> Address -> Gift
```

After the final gift-message step, the app calls Kapruka MCP to create the order and renders a payment-ready success card.

## Tech Stack

### Frontend

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS 4
- Next Image
- Web Speech API
- LocalStorage

### AI and Commerce

- Groq SDK
- `llama-3.1-8b-instant`
- Model Context Protocol SDK
- Kapruka MCP endpoint: `https://mcp.kapruka.com/mcp`

## Architecture

```text
User
  -> Next.js UI
  -> Voice or text input
  -> /api/chat
  -> Sinhala normalizer
  -> Tanglish normalizer
  -> Checkout/cart intent handling
  -> Kapruka MCP tools
       - kapruka_search_products
       - kapruka_get_product
       - kapruka_check_delivery
       - kapruka_create_order
       - kapruka_track_order
       - kapruka_list_categories
  -> Groq recommendation response
  -> Rich product/result UI
```

## Project Structure

```text
ShopMate-LK/
  README.md
  docs/
    MCP.docx
    MCP.txt
  frontend/
    app/
      api/
        chat/
          route.ts
        tools/
          route.ts
      ai.tsx
      CheckoutProgress.tsx
      globals.css
      layout.tsx
      page.tsx
    services/
      language/
        sinhala.ts
        tanglish.ts
      mcp/
        cityMapper.ts
        kapruka.ts
        productMapper.ts
        searchMapper.ts
        searchProducts.ts
    types/
      product.ts
    next.config.ts
    package.json
```

## Environment Variables

Create `frontend/.env.local`:

```env
GROQ_API_KEY=your_groq_api_key_here
```

The Kapruka MCP endpoint is currently configured directly in `frontend/services/mcp/kapruka.ts`.

## Running Locally

From the repository root:

```bash
cd frontend
npm install
npm run dev
```

Open:

```text
http://localhost:3000
```

## Scripts

Run inside `frontend/`:

```bash
npm run dev
npm run build
npm run start
npm run lint
```

## Image Hosts

External product images are rendered through `next/image`. Allowed hosts are configured in `frontend/next.config.ts`, including:

- `kapruka.com`
- `*.kapruka.com`
- `singerwebcdn.azureedge.net`

Add any new product CDN host there before using it with `next/image`.

## Key Files

- `frontend/app/ai.tsx`  
  Main chat experience, voice UI, rich product cards, cart UI, checkout UI, and order success card.

- `frontend/app/CheckoutProgress.tsx`  
  Checkout progress indicator.

- `frontend/app/api/chat/route.ts`  
  Chat API route, intent handling, checkout state handling, Groq response generation, and MCP calls.

- `frontend/services/mcp/kapruka.ts`  
  Kapruka MCP client wrapper for products, delivery, orders, tracking, and categories.

- `frontend/services/language/tanglish.ts` and `frontend/services/language/sinhala.ts`  
  Query normalization before product search and intent handling.

## Feature Details

### Product Search

Normal user searches are normalized, passed to Kapruka MCP search, mapped into app product objects, and displayed as rich result cards.

### Gift Finder

When the user asks for a gift for a specific recipient, the app asks follow-up questions for age, budget, and date. It then maps the recipient profile to a product search category and returns top recommendations.

### Cart

Users can add products from cards, review the cart with `cart`, remove products with `remove <name>`, or clear the cart with `clear cart`.

### Checkout

Typing `checkout` starts a guided workflow. The assistant collects:

- Delivery city
- Recipient name
- Phone number
- Delivery date
- Delivery address
- Sender name
- Gift message

The final step creates an order through Kapruka MCP.

### Voice

The microphone button starts browser speech recognition. Voice support depends on the user's browser and OS speech recognition support.

## Known Limitations

- Sinhala voice recognition accuracy depends on browser support.
- Product inventory, pricing, and images depend on Kapruka MCP responses.
- Payment is completed through the generated external checkout link.
- If a new external product image CDN appears, it must be added to `next.config.ts`.

## Author

Paran Kabiththanan

- GitHub: [KabiththananParan](https://github.com/KabiththananParan)
- LinkedIn: [paran-kabiththanan](https://www.linkedin.com/in/paran-kabiththanan/)

## License

This project is for educational and demonstration use unless a separate license is added.
