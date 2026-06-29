# 🇱🇰 ShopMate LK — Multilingual AI Shopping Assistant for Sri Lanka

![Next.js](https://img.shields.io/badge/Next.js-16-black)
![TypeScript](https://img.shields.io/badge/TypeScript-blue)
![AI](https://img.shields.io/badge/AI-Groq-orange)
![MCP](https://img.shields.io/badge/MCP-Kapruka-green)
![Status](https://img.shields.io/badge/Status-Production-success)

> ShopMate LK is a multilingual AI-powered shopping assistant built for Sri Lankan e-commerce. It enables users to discover products, build carts, schedule deliveries, create gift orders, and complete purchases using **English, Tanglish, Sinhala, and voice commands**.

---

## 🌟 Why ShopMate LK?

Traditional e-commerce websites require users to manually search, filter, compare, and navigate multiple pages before making a purchase.

ShopMate LK transforms this experience into a conversational AI assistant that understands how Sri Lankans naturally communicate.

Examples:

### English

> "I need a birthday cake for my sister."

### Tanglish

> "mama cake ekak ganna oni"

### Sinhala

> "මට කේක් එකක් ඕන"

---

# ✨ Features

### 🤖 AI Product Discovery

* Natural language product search
* AI-generated product recommendations
* Product comparison assistance

### 🛒 Smart Shopping Cart

* Multi-item cart support
* Quantity management
* Cart persistence using localStorage
* Remove items
* Clear cart

### 🎁 Gift Commerce

* Gift sender support
* Personalized gift messages
* Recipient management

### 📦 Intelligent Checkout

* Delivery city validation
* Delivery date selection
* Recipient information collection
* Address management
* Order confirmation workflow

### 💳 Order Processing

* Kapruka order creation
* Dynamic payment links
* Order tracking
* Delivery cost calculation

### 🎙️ Voice Shopping

* Voice-enabled product search
* Voice-enabled checkout workflow

### 🇱🇰 Sri Lankan Language Support

#### English

```
I need a cake
```

#### Tanglish

```
mama cake ekak ganna oni
```

#### Sinhala

```
මට කේක් එකක් ඕන
```

---

# 🏗️ Architecture

```text
User
   ↓
Voice/Text Input
   ↓
Language Normalization
   ├── Sinhala
   ├── Tanglish
   └── English
   ↓
AI Processing Layer
   ↓
Kapruka MCP Tools
   ├── Product Search
   ├── Delivery Check
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

### Features

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

# 🎥 Demo Scenarios

### Product Discovery

```
I need a birthday cake.
```

### Tanglish

```
mama cake ekak ganna oni
```

### Sinhala

```
මට කේක් එකක් ඕන
```

### Checkout

```
checkout
yes
Jaffna
Kabi
0766580968
2026-07-11
Jaffna
Paran
Happy Birthday ❤️
```

---

# 🏆 Highlights

✅ Multilingual AI Shopping Assistant

✅ Sinhala Language Support

✅ Tanglish Language Support

✅ Voice Shopping

✅ Smart Checkout Workflow

✅ Gift Commerce Features

✅ AI Product Recommendations

✅ Kapruka MCP Integration

---

# 👨‍💻 Author

**Paran Kabiththanan**

* GitHub: https://github.com/KabiththananParan
* LinkedIn: https://www.linkedin.com/in/paran-kabiththanan/

---

Built with ❤️ for Sri Lankan e-commerce.
