# 🇱🇰 ShopMate LK — Multilingual AI Shopping Assistant for Sri Lanka

![Next.js](https://img.shields.io/badge/Next.js-16-black)
![TypeScript](https://img.shields.io/badge/TypeScript-blue)
![AI](https://img.shields.io/badge/AI-Groq-orange)
![MCP](https://img.shields.io/badge/MCP-Kapruka-green)
![Status](https://img.shields.io/badge/Status-Production-success)

> **ShopMate LK** is a multilingual AI-powered shopping assistant built for Sri Lankan e-commerce. It enables users to discover products, build carts, schedule deliveries, create gift orders, and complete purchases using **English, Tanglish, Sinhala, and voice commands**.

---

# 🌟 Why ShopMate LK?

Traditional e-commerce requires users to manually search, filter, compare, and navigate through multiple pages before purchasing.

ShopMate LK transforms shopping into a conversational experience by allowing users to communicate naturally in the languages they already use.

### English

> "I need a birthday cake for my sister."

### Tanglish

> "mama cake ekak ganna oni"

### Sinhala

> "මට කේක් එකක් ඕන"

---

# ✨ Features

## 🤖 AI Product Discovery

* Natural language product search
* AI-powered recommendations
* Product comparison assistance
* Context-aware shopping conversations

## 🛒 Smart Shopping Cart

* Multi-item cart support
* Quantity controls
* Remove products
* Clear cart
* Persistent cart using localStorage

## 🎁 Gift Commerce

* Gift sender support
* Personalized gift messages
* Recipient management

## 📦 Intelligent Checkout

* Guided checkout workflow
* Delivery city validation
* Delivery date selection
* Recipient collection
* Address management
* Order confirmation

## 💳 Order Processing

* Kapruka order creation
* Dynamic payment links
* Order tracking
* Delivery cost calculation

## 🎙️ Voice Shopping

* Voice-enabled product search
* English voice support
* Tanglish voice support
* Experimental Sinhala voice support

## 🇱🇰 Multilingual Support

* English
* Tanglish
* Sinhala

---

# 🚀 How To Use ShopMate LK

## 1️⃣ Search Products

Search naturally using any supported language.

### English

```text
I need a birthday cake
```

```text
Show me flower bouquets under LKR 5000
```

### Tanglish

```text
mama cake ekak ganna oni
```

```text
mata flower ekak yawanawa
```

### Sinhala

```text
මට කේක් එකක් ඕන
```

```text
මල් යවන්න ඕන
```

---

## 2️⃣ Voice Shopping 🎤

Click the microphone icon and speak naturally.

### English

```text
I need a cake
```

### Tanglish (recommended)

```text
mama cake ekak ganna oni
```

```text
mata flower ekak yawanawa
```

### Sinhala

```text
මට කේක් එකක් ඕන
```

> ⚠️ Browser speech recognition currently performs best with English and Tanglish. Sinhala accuracy depends on browser support.

---

## 3️⃣ Add Products To Cart

When products appear:

```text
Click:
Add To Bag
```

Features:

* Add multiple products
* Increase quantities
* Remove products
* Clear cart
* Persistent cart after refresh

---

## 4️⃣ View Cart

Example:

```text
Blackcherry Velvet Bento Cheesecake × 2
Blueberry Bliss Bento Cheesecake × 1

Total: LKR 11,960
```

---

## 5️⃣ Checkout

Simply type:

```text
checkout
```

ShopMate LK guides users through the entire order process.

### Example Checkout Flow

```text
checkout
yes
Jaffna
Kabi
0766580968
2026-07-11
Jaffna Town
Paran
Happy Birthday ❤️
```

The assistant automatically collects:

* Delivery city
* Recipient
* Phone number
* Delivery date
* Address
* Gift sender
* Gift message

---

## 6️⃣ Order Creation

After checkout:

```text
✓ Order Created
```

Users receive:

* Order ID
* Total amount
* Payment link

Example:

```text
Order:
ORD-20260630-EHFU

Total:
LKR 58,820
```

---

## 7️⃣ Payment

Click:

```text
Pay Now
```

to continue to the official Kapruka checkout page.

---

## 8️⃣ Order Tracking

Track orders using:

```text
track ORD-20260630-EHFU
```

---

# 🏗️ Architecture

```text
User
   ↓
Voice/Text Input
   ↓
Language Processing
   ├── Sinhala Normalizer
   ├── Tanglish Normalizer
   └── English
   ↓
AI Recommendation Engine
   ↓
Kapruka MCP
       ├── Product Search
       ├── Delivery Validation
       ├── Order Creation
       └── Order Tracking
   ↓
Checkout Workflow Engine
   ↓
Payment Link Generation
```

---

# 🔄 Checkout Workflow

```text
Search Product
      ↓
Add To Cart
      ↓
Checkout
      ↓
Confirm
      ↓
Delivery City
      ↓
Recipient
      ↓
Phone Number
      ↓
Delivery Date
      ↓
Address
      ↓
Sender
      ↓
Gift Message
      ↓
Create Order
      ↓
Payment Link
```

---

# 💡 Demo Flow

## Voice + Tanglish

```text
🎤 mama cake ekak ganna oni
```

## Add To Cart

```text
Add To Bag
```

## Checkout

```text
checkout
```

## Gift Order

```text
Jaffna
Kabi
0766580968
2026-07-11
Jaffna Town
Paran
Happy Birthday ❤️
```

## Payment

```text
Pay Now
```

---

# 🛠️ Tech Stack

### Frontend

* Next.js 16
* React
* TypeScript
* Tailwind CSS

### AI

* Groq API
* Llama 3.1 8B

### Commerce

* Kapruka MCP Server
* Model Context Protocol (MCP)

### Additional Features

* Web Speech API
* LocalStorage Persistence
* Multilingual Query Processing

---

# 📂 Project Structure

```text
frontend/
│
├── app/
│   ├── api/
│   │   ├── chat/
│   │   └── tools/
│   ├── ai.tsx
│   └── page.tsx
│
├── services/
│   ├── mcp/
│   │   ├── kapruka.ts
│   │   └── cityMapper.ts
│   │
│   └── language/
│       ├── tanglish.ts
│       └── sinhala.ts
│
└── components/
```

---

# 🚀 Running Locally

```bash
git clone <repository-url>

cd frontend

npm install

npm run dev
```

Open:

```text
http://localhost:3000
```

---

# 🏆 Highlights

✅ Multilingual AI Shopping Assistant

✅ Sinhala Language Support

✅ Tanglish Language Support

✅ Voice Shopping

✅ Multi-Item Cart

✅ Gift Commerce

✅ Smart Checkout Workflow

✅ Payment Integration

✅ Order Tracking

✅ Kapruka MCP Integration

---

# ⚠️ Known Limitations

* Sinhala voice recognition accuracy depends on browser support.
* Payment processing is completed through Kapruka's external checkout page.
* Product availability depends on live Kapruka inventory.

---

# 👨‍💻 Author

**Paran Kabiththanan**

* GitHub: https://github.com/KabiththananParan
* LinkedIn: https://www.linkedin.com/in/paran-kabiththanan/

---

Built with ❤️ for Sri Lankan e-commerce.
