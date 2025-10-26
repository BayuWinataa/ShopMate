# ShopMate AI 🤖🛍️

ShopMate adalah aplikasi e-commerce modern dengan integrasi AI, dibangun menggunakan Next.js 15, Supabase, dan Groq AI. Aplikasi ini menyediakan pengalaman belanja online yang lengkap dengan fitur admin panel, chat AI assistant, dan dashboard user yang interaktif.

## 📋 Daftar Isi

- [Fitur Utama](#fitur-utama)
- [Tech Stack](#tech-stack)
- [Arsitektur Aplikasi](#arsitektur-aplikasi)
- [Instalasi](#instalasi)
- [Konfigurasi](#konfigurasi)
- [Alur Aplikasi](#alur-aplikasi)
- [Dokumentasi Fitur](#dokumentasi-fitur)
- [Struktur Folder](#struktur-folder)
- [API Routes](#api-routes)
- [Deployment](#deployment)

---

## 🚀 Fitur Utama

### 🛒 **Fitur Customer**
- **Landing Page** - Halaman utama dengan hero section, advantages, flow section, dan CTA
- **Katalog Produk** - Browse produk dengan detail lengkap (nama, harga, deskripsi, gambar)
- **Detail Produk** - Lihat spesifikasi lengkap produk
- **Shopping Cart** - Keranjang belanja dengan fitur add/remove items
- **Checkout** - Proses pemesanan dengan data customer (nama, telepon, alamat)
- **Order History** - Lihat riwayat pesanan di dashboard
- **AI Chat Assistant** - Chat dengan AI untuk bantuan produk dan pemesanan
- **User Dashboard** - Dashboard personal dengan statistics dan recent activities

### 👨‍💼 **Fitur Admin**
- **Admin Dashboard** - Overview statistik (total products, orders, customers, revenue)
- **Product Management** - CRUD produk (Create, Read, Update, Delete)
- **Order Management** - Lihat dan kelola pesanan customer
- **Cart Items Monitoring** - Monitor cart items dari semua customer
- **Customer Management** - Lihat data pelanggan (coming soon)
- **Settings** - Pengaturan aplikasi (coming soon)

### 🤖 **AI Features**
- **Product Recommendations** - AI memberikan rekomendasi produk berdasarkan preferensi
- **Order Assistance** - Bantuan AI untuk proses pemesanan
- **Product Comparison** - Bandingkan produk menggunakan AI
- **Dashboard AI Assistant** - Tanya AI tentang order summary dan insights
- **Natural Language Processing** - Interaksi menggunakan bahasa natural

---

## 🛠️ Tech Stack

### **Frontend**
- **Next.js 15** (App Router) - React framework dengan server components
- **React 19** - UI library
- **Tailwind CSS 4** - Utility-first CSS framework
- **shadcn/ui** - Komponen UI yang dapat dikustomisasi
- **Framer Motion** - Animasi dan transisi smooth
- **Recharts** - Library untuk chart dan visualisasi data
- **Lucide React** - Icon library

### **Backend & Database**
- **Supabase** - Backend as a Service (PostgreSQL, Auth, Storage)
- **Supabase SSR** - Server-side rendering support untuk auth
- **Next.js API Routes** - API endpoints serverless

### **AI & ML**
- **Groq SDK** - AI inference dengan model Llama
- **React Markdown** - Render response AI dalam format markdown

### **Authentication**
- **Supabase Auth** - Email/password authentication
- **Google OAuth** - Login dengan akun Google
- **Session Management** - Session handling dengan cookies & localStorage

### **Styling & UI**
- **Radix UI** - Primitives untuk accessible components
- **Class Variance Authority (CVA)** - Variant styling
- **Tailwind Merge** - Merge Tailwind classes dengan smart conflict resolution
- **Sonner** - Toast notifications

### **Dev Tools**
- **ESLint** - Code linting
- **Turbopack** - Fast bundler untuk development

---

## 🏗️ Arsitektur Aplikasi

### **Route Groups**
Aplikasi menggunakan Next.js App Router dengan route groups untuk organisasi yang lebih baik:

```
app/
├── (site)/          # Public pages (landing, products, cart)
├── (auth)/          # Authentication pages (login, register)
├── (private)/       # Protected user pages (dashboard, orders, addresses)
├── (admin)/         # Admin panel pages
└── api/             # API routes
```

### **Data Flow**

```
┌─────────────┐
│   Client    │
│  (Browser)  │
└──────┬──────┘
       │
       │ HTTP Requests
       │
┌──────▼──────────────────┐
│   Next.js Server        │
│  ┌──────────────────┐   │
│  │  API Routes      │   │
│  │  - /api/chat     │   │
│  │  - /api/orders   │   │
│  │  - /api/compare  │   │
│  └────────┬─────────┘   │
│           │              │
│  ┌────────▼─────────┐   │
│  │ Server Components│   │
│  │ - Product Pages  │   │
│  │ - Admin Pages    │   │
│  └────────┬─────────┘   │
└───────────┼─────────────┘
            │
      ┌─────▼─────┐
      │  Supabase │
      │ (Database)│
      └─────┬─────┘
            │
      ┌─────▼─────┐
      │  Groq AI  │
      │ (LLM API) │
      └───────────┘
```

### **Authentication Flow**

```
┌──────────────────────────────────────────────────────────┐
│                    Auth Flow                              │
└──────────────────────────────────────────────────────────┘

User Login/Register
        │
        ▼
┌───────────────┐
│ Login Page    │──────► Google OAuth ──┐
│ /login        │                       │
└───────┬───────┘                       │
        │                               │
        │ Email/Password                │
        ▼                               ▼
┌───────────────────────────────────────────┐
│      Supabase Auth                        │
│  - Create session                         │
│  - Store user data                        │
│  - Generate tokens                        │
└───────────────┬───────────────────────────┘
                │
                ▼
        ┌───────────────┐
        │ AuthProvider  │
        │ Context       │
        └───────┬───────┘
                │
    ┌───────────┴───────────┐
    │                       │
    ▼                       ▼
┌─────────┐          ┌──────────┐
│  User   │          │  Admin   │
│Dashboard│          │  Panel   │
└─────────┘          └──────────┘
```

---

## 📦 Instalasi

### **Prerequisites**
- Node.js 18+ 
- pnpm (atau npm/yarn)
- Akun Supabase
- Akun Groq AI

### **Langkah Instalasi**

1. **Clone repository**
```bash
git clone https://github.com/BayuWinataa/ShopMate.git
cd ShopMate
```

2. **Install dependencies**
```bash
pnpm install
```

3. **Setup environment variables**
Buat file `.env.local` di root folder:
```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Groq AI
GROQ_API_KEY=your_groq_api_key
```

4. **Setup Supabase Database**

Buat tabel-tabel berikut di Supabase:

```sql
-- Table: Products
CREATE TABLE "Products" (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  description TEXT,
  image_url TEXT,
  stock INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Table: customers
CREATE TABLE customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  address TEXT,
  note TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Table: orders
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_code VARCHAR(50) UNIQUE NOT NULL,
  customer_id UUID REFERENCES customers(id),
  payment_method VARCHAR(50),
  status VARCHAR(50) DEFAULT 'pending',
  subtotal DECIMAL(10,2),
  total DECIMAL(10,2),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Table: order_items
CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_id INTEGER REFERENCES "Products"(id),
  name VARCHAR(255),
  price DECIMAL(10,2),
  qty INTEGER,
  subtotal DECIMAL(10,2),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Table: addresses
CREATE TABLE addresses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  label VARCHAR(100),
  recipient_name VARCHAR(255),
  phone VARCHAR(50),
  address TEXT NOT NULL,
  city VARCHAR(100),
  province VARCHAR(100),
  postal_code VARCHAR(20),
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
);
```

5. **Setup Supabase Auth**
- Enable Email/Password authentication di Supabase Dashboard
- Enable Google OAuth (optional)
- Configure redirect URLs: `http://localhost:3000/auth/callback`

6. **Run development server**
```bash
pnpm dev
```

Aplikasi akan berjalan di [http://localhost:3000](http://localhost:3000)

---

## ⚙️ Konfigurasi

### **Supabase Configuration**
File: `src/lib/supabase/client.js` dan `src/lib/supabase/server.js`

```javascript
// Browser client untuk client components
export function createSupabaseBrowserClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  )
}

// Server client untuk server components
export function createSupabaseServerClient() {
  // Uses cookies for SSR
}
```

### **Auth Provider**
File: `src/lib/auth-context.jsx`

Menyediakan context untuk authentication state di seluruh aplikasi:
- `user` - Current user object
- `loading` - Loading state
- `signOut()` - Logout function
- `supabase` - Supabase client instance

### **Cart Provider**
File: `src/components/cart/CartProvider.jsx`

Mengelola shopping cart state dengan localStorage:
- `cartItems` - Array of cart items
- `addToCart()` - Add product to cart
- `removeFromCart()` - Remove product
- `updateQuantity()` - Update item quantity
- `clearCart()` - Clear all items

---

## 🔄 Alur Aplikasi

### **1. Alur Customer - Belanja Produk**

```
┌─────────────────────────────────────────────────────────────┐
│          Customer Shopping Flow                              │
└─────────────────────────────────────────────────────────────┘

Landing Page (/)
    │
    ▼
Browse Products (/products)
    │
    ├─► View Product Detail (/products/[id])
    │       │
    │       ▼
    │   Add to Cart
    │       │
    ▼       ▼
Shopping Cart (/cart)
    │
    ├─► Update Quantities
    ├─► Remove Items
    │
    ▼
Checkout (Fill Customer Data)
    │
    ▼
Create Order (API: /api/orders)
    │
    ├─► Save to Supabase
    ├─► Generate Order Code
    │
    ▼
Order Success
    │
    ▼
View in Dashboard (/dashboard/orders)
```

**Detail Steps:**

1. **Landing Page** - User membuka homepage
2. **Browse Products** - User melihat katalog produk dari Supabase
3. **Product Detail** - Klik produk untuk lihat detail lengkap
4. **Add to Cart** - Tambah produk ke keranjang (simpan di localStorage)
5. **Shopping Cart** - Review cart, update qty, atau hapus items
6. **Checkout** - Isi data customer (nama, telepon, alamat, catatan)
7. **Submit Order** - POST ke `/api/orders`, simpan ke Supabase
8. **Order Created** - Order berhasil, dapat dilihat di dashboard

### **2. Alur Customer - Chat dengan AI**

```
┌─────────────────────────────────────────────────────────────┐
│             AI Chat Flow                                     │
└─────────────────────────────────────────────────────────────┘

Open Chat Page (/chat)
    │
    ▼
User Type Message
    │
    ▼
Send to API (/api/chat)
    │
    ├─► Load Product Context from Supabase
    ├─► Build Prompt with Context
    ├─► Send to Groq AI (Llama model)
    │
    ▼
AI Response
    │
    ├─► Product Recommendations
    ├─► Order Assistance
    ├─► Product Comparison
    │
    ▼
Display Response (Markdown)
    │
    ▼
User Can Continue Conversation
```

**AI Capabilities:**
- Rekomendasi produk berdasarkan preferensi
- Informasi detail produk
- Perbandingan produk
- Bantuan pemesanan
- FAQ seputar belanja

### **3. Alur Admin - Kelola Produk**

```
┌─────────────────────────────────────────────────────────────┐
│          Admin Product Management Flow                       │
└─────────────────────────────────────────────────────────────┘

Admin Login
    │
    ▼
sessionStorage.setItem('adminAuth', 'true')
    │
    ▼
Admin Dashboard (/admin)
    │
    ├─► View Statistics
    │   - Total Products
    │   - Total Orders
    │   - Total Customers
    │   - Revenue
    │
    ▼
Product Management (/admin/products)
    │
    ├─► View All Products (Server Component)
    │   └─► Fetch from Supabase
    │
    ├─► Create New Product
    │   └─► ProductCreateDialog
    │       ├─► Fill: name, price, desc, image, stock
    │       └─► POST → Save to Supabase
    │
    ├─► Edit Product
    │   └─► ProductEditDialog
    │       ├─► Load existing data
    │       ├─► Update fields
    │       └─► PUT → Update Supabase
    │
    ├─► View Product Details
    │   └─► ProductViewDialog
    │       └─► Display full info (read-only)
    │
    └─► Delete Product
        └─► ProductDeleteButton
            ├─► Confirm dialog
            └─► DELETE → Remove from Supabase
```

### **4. Alur Admin - Kelola Orders**

```
Admin Orders Page (/admin/orders)
    │
    ├─► View All Orders
    │   └─► Fetch from Supabase (orders + customers + order_items)
    │
    ├─► View Order Details
    │   ├─► Customer Info
    │   ├─► Items Ordered
    │   ├─► Payment Method
    │   └─► Order Status
    │
    └─► Update Order Status (coming soon)
```

### **5. Alur User Dashboard**

```
┌─────────────────────────────────────────────────────────────┐
│            User Dashboard Flow                               │
└─────────────────────────────────────────────────────────────┘

User Login (/login)
    │
    ▼
Dashboard Home (/dashboard)
    │
    ├─► View Statistics
    │   - Total Orders
    │   - Total Spent
    │   - Unpaid Invoices
    │
    ├─► View Spending Chart (Last 30 Days)
    │   └─► LineChart with Recharts
    │
    ├─► Recent Orders (Latest 3)
    │   └─► Link to full order history
    │
    ├─► Recent Chats
    │   └─► Link to chat page
    │
    └─► AI Assistant
        └─► Ask about orders & insights
```

### **6. Alur Address Management**

```
User Dashboard → Addresses (/dashboard/address)
    │
    ├─► View All Addresses
    │   └─► Fetch from Supabase
    │
    ├─► Add New Address
    │   ├─► Fill form (label, name, phone, address, city, etc)
    │   └─► POST → Save to Supabase
    │
    ├─► Edit Address
    │   └─► Update existing address
    │
    ├─► Delete Address
    │   └─► Remove from Supabase
    │
    └─► Set Default Address
        └─► Update is_default flag
```

---

## 📚 Dokumentasi Fitur

### **A. Authentication System**

#### **Login Flow**
- **Route:** `/login`
- **Component:** `src/app/(auth)/login/LoginClient.jsx`
- **Features:**
  - Email/Password login
  - Google OAuth login
  - Remember me functionality
  - Redirect to dashboard after success
  - Form validation dengan Zod

```javascript
// Login dengan email/password
const handleLogin = async (email, password) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  })
}

// Login dengan Google
const handleGoogleLogin = async () => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${origin}/auth/callback`
    }
  })
}
```

#### **Register Flow**
- **Route:** `/register`
- **Component:** `src/app/(auth)/register/RegisterClient.jsx`
- **Features:**
  - Email/Password registration
  - Google OAuth registration
  - Form validation
  - Auto-login after registration

#### **Auth Callback**
- **Route:** `/auth/callback`
- **Purpose:** Handle OAuth redirect dari Google
- **Flow:** Exchange code → Set session → Redirect ke dashboard

### **B. Product Management**

#### **Product List (Customer View)**
- **Route:** `/products`
- **Component:** `src/app/(site)/products/page.jsx`
- **Features:**
  - Grid view semua produk
  - Product card dengan image, nama, harga
  - Link ke detail produk
  - Add to cart button
  - Server-side data fetching dari Supabase

#### **Product Detail**
- **Route:** `/products/[id]`
- **Features:**
  - Full product information
  - Large product image
  - Stock availability
  - Add to cart dengan quantity selector
  - Back to products link

#### **Product Management (Admin)**
- **Route:** `/admin/products`
- **Component:** `src/app/(admin)/admin/products/page.jsx`
- **Features:**
  - Tabel view semua produk dengan pagination
  - CRUD operations via dialogs
  - Server component dengan Supabase fetch
  - Real-time data updates

**Product CRUD Dialogs:**

1. **Create Product** - `ProductCreateDialog.jsx`
   - Form fields: name, price, description, image_url, stock
   - Validation dengan Zod
   - POST to Supabase

2. **Edit Product** - `ProductEditDialog.jsx`
   - Pre-filled form dengan data existing
   - Update fields
   - PUT to Supabase

3. **View Product** - `ProductViewDialog.jsx`
   - Read-only display
   - All product details

4. **Delete Product** - `ProductDeleteButton.jsx`
   - Confirmation dialog
   - DELETE from Supabase

### **C. Shopping Cart System**

#### **Cart Context**
- **Provider:** `CartProvider.jsx`
- **Storage:** localStorage dengan key `shopping_cart`
- **State:**
  ```javascript
  {
    cartItems: [
      {
        id: number,
        name: string,
        price: number,
        quantity: number,
        image_url: string
      }
    ]
  }
  ```

#### **Cart Operations**
```javascript
// Add to cart
addToCart(product)

// Remove item
removeFromCart(productId)

// Update quantity
updateQuantity(productId, newQuantity)

// Clear cart
clearCart()

// Get total
const total = cartItems.reduce((sum, item) => 
  sum + (item.price * item.quantity), 0
)
```

#### **Cart UI Components**

1. **CartButton** - Badge button showing cart count
2. **CartSheet** - Sidebar cart dengan item list
3. **Cart Page** - Full cart page (`/cart`)
   - Item list dengan quantity controls
   - Subtotal calculation
   - Checkout form
   - Submit order

### **D. Order Management**

#### **Create Order Flow**
```javascript
// API Route: /api/orders (POST)
1. Receive: { customer, items, paymentMethod }
2. Generate order_code
3. Create customer record
4. Create order record
5. Create order_items records
6. Return order details
```

#### **Order List (Customer)**
- **Route:** `/dashboard/orders`
- **Component:** `OrdersClient.jsx`
- **Features:**
  - List semua orders user
  - Filter by status
  - Order details dengan items
  - Payment method info

#### **Order List (Admin)**
- **Route:** `/admin/orders`
- **Features:**
  - View all orders from all customers
  - Customer information
  - Order items breakdown
  - Order status management (coming soon)

### **E. AI Chat System**

#### **Chat Interface**
- **Route:** `/chat`
- **Component:** `src/app/(site)/chat/page.jsx`
- **Features:**
  - Real-time chat interface
  - Message history (localStorage)
  - Markdown rendering untuk AI responses
  - Typing indicator
  - Auto-scroll to latest message

#### **AI Integration**
```javascript
// API Route: /api/chat (POST)
1. Receive user message
2. Fetch product context from Supabase
3. Build system prompt dengan product data
4. Send to Groq AI (Llama 3 model)
5. Stream response back to client
6. Display formatted response
```

#### **AI Capabilities**
- Product recommendations
- Product comparison
- Order assistance
- Shopping advice
- General customer support

### **F. Dashboard & Analytics**

#### **User Dashboard**
- **Route:** `/dashboard`
- **Component:** `DashboardClient.jsx`
- **Widgets:**
  1. **Statistics Cards**
     - Total Orders
     - Total Spent (IDR)
     - Unpaid Invoices
     
  2. **Spending Chart** (Recharts LineChart)
     - Last 30 days
     - Daily spending visualization
     - Interactive tooltips
     
  3. **Recent Orders**
     - Latest 3 orders
     - Quick view dengan link ke full history
     
  4. **Recent Chats**
     - Latest AI conversations
     
  5. **AI Assistant Modal**
     - In-dashboard AI chat
     - Order insights & analysis

#### **Admin Dashboard**
- **Route:** `/admin`
- **Component:** `src/app/(admin)/admin/page.jsx`
- **Widgets:**
  - Statistics overview
  - Recent orders table
  - Quick actions
  - Performance metrics (coming soon)

### **G. Address Management**

#### **Address CRUD**
- **Route:** `/dashboard/address`
- **Component:** `AddressesClient.jsx`
- **Features:**
  - Add new address
  - Edit existing address
  - Delete address
  - Set default address
  - Form validation

**Address Schema:**
```javascript
{
  id: UUID,
  user_id: UUID,
  label: string,           // "Rumah", "Kantor", etc
  recipient_name: string,
  phone: string,
  address: string,
  city: string,
  province: string,
  postal_code: string,
  is_default: boolean
}
```

---

## 📁 Struktur Folder

```
belajar-supabase/
├── src/
│   ├── app/
│   │   ├── (site)/              # Public pages
│   │   │   ├── layout.js
│   │   │   ├── page.jsx         # Landing page
│   │   │   ├── products/
│   │   │   │   ├── page.jsx     # Product list
│   │   │   │   └── [id]/
│   │   │   │       └── page.jsx # Product detail
│   │   │   ├── cart/
│   │   │   │   └── page.jsx     # Shopping cart
│   │   │   └── chat/
│   │   │       └── page.jsx     # AI chat
│   │   │
│   │   ├── (auth)/              # Authentication
│   │   │   ├── login/
│   │   │   │   ├── page.jsx
│   │   │   │   └── LoginClient.jsx
│   │   │   └── register/
│   │   │       ├── page.jsx
│   │   │       └── RegisterClient.jsx
│   │   │
│   │   ├── (private)/           # Protected user pages
│   │   │   ├── layout.jsx
│   │   │   └── dashboard/
│   │   │       ├── page.jsx
│   │   │       ├── orders/
│   │   │       │   └── page.jsx
│   │   │       └── address/
│   │   │           └── page.jsx
│   │   │
│   │   ├── (admin)/             # Admin panel
│   │   │   ├── layout.jsx
│   │   │   └── admin/
│   │   │       ├── page.jsx     # Admin dashboard
│   │   │       ├── products/
│   │   │       │   └── page.jsx # Product management
│   │   │       ├── orders/
│   │   │       │   └── page.jsx # Order management
│   │   │       ├── cart-items/
│   │   │       │   └── page.jsx # Cart monitoring
│   │   │       ├── customers/
│   │   │       │   └── page.jsx # Customer list
│   │   │       └── settings/
│   │   │           └── page.jsx # Settings
│   │   │
│   │   ├── api/                 # API Routes
│   │   │   ├── chat/
│   │   │   │   └── route.js     # AI chat endpoint
│   │   │   ├── orders/
│   │   │   │   └── route.js     # Order CRUD
│   │   │   ├── addresses/
│   │   │   │   ├── route.js     # Address list & create
│   │   │   │   └── [id]/
│   │   │   │       └── route.js # Address update & delete
│   │   │   └── compare/
│   │   │       └── route.js     # Product comparison
│   │   │
│   │   ├── auth/
│   │   │   └── callback/
│   │   │       └── route.js     # OAuth callback
│   │   │
│   │   ├── globals.css
│   │   └── layout.js            # Root layout
│   │
│   ├── components/
│   │   ├── admin/               # Admin components
│   │   │   ├── Sidebar.jsx
│   │   │   ├── Topbar.jsx
│   │   │   ├── StatsSection.jsx
│   │   │   ├── OrdersTable.jsx
│   │   │   ├── ProductsList.jsx
│   │   │   ├── ProductCreateDialog.jsx
│   │   │   ├── ProductEditDialog.jsx
│   │   │   ├── ProductViewDialog.jsx
│   │   │   ├── ProductDeleteButton.jsx
│   │   │   └── CartItemViewDialog.jsx
│   │   │
│   │   ├── auth/                # Auth components
│   │   │   └── back.jsx
│   │   │
│   │   ├── cart/                # Cart components
│   │   │   ├── CartProvider.jsx
│   │   │   ├── CartButton.jsx
│   │   │   ├── CartSheet.jsx
│   │   │   ├── AddToCartButton.jsx
│   │   │   ├── OrdersClient.jsx
│   │   │   └── client-cart.jsx
│   │   │
│   │   ├── dashboard/           # Dashboard components
│   │   │   ├── DashboardClient.jsx
│   │   │   ├── AddressesClient.jsx
│   │   │   └── SidebarNav.jsx
│   │   │
│   │   ├── site/                # Site components
│   │   │   ├── Header.jsx
│   │   │   ├── sosmed.jsx
│   │   │   └── landing/
│   │   │       ├── HeroSection.jsx
│   │   │       ├── AdvantagesSection.jsx
│   │   │       ├── FlowSection.jsx
│   │   │       └── CtaSection.jsx
│   │   │
│   │   ├── ui/                  # shadcn/ui components
│   │   │   ├── button.jsx
│   │   │   ├── card.jsx
│   │   │   ├── dialog.jsx
│   │   │   ├── input.jsx
│   │   │   ├── table.jsx
│   │   │   ├── pagination.jsx
│   │   │   └── ...
│   │   │
│   │   ├── FlowStep.jsx
│   │   ├── footer.jsx
│   │   ├── loader.jsx
│   │   └── logout-button.jsx
│   │
│   └── lib/
│       ├── auth-context.jsx     # Auth context provider
│       ├── auth.js              # Auth utilities
│       ├── cart.js              # Cart utilities
│       ├── utils.js             # General utilities
│       ├── supabase/
│       │   ├── client.js        # Browser client
│       │   └── server.js        # Server client
│       └── validation/
│           └── auth.js          # Zod schemas
│
├── public/                      # Static assets
│   └── ...
│
├── .env.local                   # Environment variables (gitignored)
├── components.json              # shadcn/ui config
├── next.config.mjs              # Next.js config
├── tailwind.config.js           # Tailwind config
├── postcss.config.mjs           # PostCSS config
├── package.json
└── README.md
```

---

## 🔌 API Routes

### **1. POST /api/chat**
Chat dengan AI assistant

**Request:**
```json
{
  "messages": [
    { "role": "user", "content": "Rekomendasi laptop gaming" }
  ]
}
```

**Response:**
```json
{
  "reply": "Berikut rekomendasi laptop gaming terbaik..."
}
```

### **2. POST /api/orders**
Create new order

**Request:**
```json
{
  "customer": {
    "name": "John Doe",
    "phone": "08123456789",
    "address": "Jl. Example No. 123",
    "note": "Kirim pagi"
  },
  "items": [
    {
      "id": 1,
      "name": "Product A",
      "price": 100000,
      "quantity": 2
    }
  ],
  "paymentMethod": "transfer"
}
```

**Response:**
```json
{
  "success": true,
  "order": {
    "id": "uuid",
    "order_code": "ORD-1234567890",
    "total": 200000
  }
}
```

### **3. GET /api/orders**
Get all orders (admin) atau user orders

**Query Params:**
- `user_id` (optional) - Filter by user

**Response:**
```json
{
  "orders": [
    {
      "id": "uuid",
      "order_code": "ORD-1234567890",
      "status": "paid",
      "total": 200000,
      "created_at": "2025-01-01T10:00:00Z",
      "customer": { /* customer data */ },
      "items": [ /* order items */ ]
    }
  ]
}
```

### **4. POST /api/addresses**
Create new address

**Request:**
```json
{
  "label": "Rumah",
  "recipient_name": "John Doe",
  "phone": "08123456789",
  "address": "Jl. Example No. 123",
  "city": "Jakarta",
  "province": "DKI Jakarta",
  "postal_code": "12345",
  "is_default": true
}
```

### **5. GET /api/addresses**
Get user addresses

**Response:**
```json
{
  "addresses": [ /* address list */ ]
}
```

### **6. PUT /api/addresses/[id]**
Update address

### **7. DELETE /api/addresses/[id]**
Delete address

### **8. POST /api/compare**
Compare products dengan AI

**Request:**
```json
{
  "productIds": [1, 2, 3]
}
```

**Response:**
```json
{
  "comparison": "Perbandingan detail produk..."
}
```

---

## 🎨 UI/UX Features

### **Design System**
- **Color Theme:** Violet/Purple gradient
- **Typography:** System fonts dengan Geist fallback
- **Components:** shadcn/ui dengan custom styling
- **Animations:** Framer Motion untuk smooth transitions
- **Responsive:** Mobile-first design

### **Component Variants**
```javascript
// Button variants
<Button variant="pressViolet">Primary</Button>
<Button variant="pressPurple">Secondary</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>

// Sizes
<Button size="sm">Small</Button>
<Button size="default">Default</Button>
<Button size="lg">Large</Button>
<Button size="icon">Icon</Button>
```

### **Theme Features**
- Consistent violet color palette
- Focus states dengan violet rings
- Hover effects dengan smooth transitions
- Active states dengan shadow effects
- Loading states dengan spinners
- Toast notifications dengan Sonner

---

## 🚀 Deployment

### **Vercel (Recommended)**

1. Push code ke GitHub
2. Import project di Vercel
3. Configure environment variables
4. Deploy

```bash
# Install Vercel CLI
pnpm add -g vercel

# Deploy
vercel
```

### **Environment Variables di Production**
```env
NEXT_PUBLIC_SUPABASE_URL=your_production_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_production_key
GROQ_API_KEY=your_groq_key
```

### **Build untuk Production**
```bash
pnpm build
pnpm start
```

---

## 🔐 Security Best Practices

1. **Environment Variables**
   - Jangan commit `.env.local`
   - Use different keys untuk dev/prod
   - Rotate keys secara berkala

2. **Supabase RLS (Row Level Security)**
   - Enable RLS pada semua tables
   - Configure policies untuk user access
   - Restrict admin actions

3. **API Protection**
   - Validate input dengan Zod
   - Rate limiting (optional)
   - Error handling yang proper

4. **Authentication**
   - Secure session handling
   - HTTPS only in production
   - OAuth callback validation

---

## 🐛 Troubleshooting

### **Common Issues**

1. **Supabase connection error**
   - Check environment variables
   - Verify Supabase URL & anon key
   - Check network/firewall

2. **Cart not persisting**
   - Check localStorage availability
   - Clear browser cache
   - Check CartProvider wrapping

3. **AI chat not working**
   - Verify GROQ_API_KEY
   - Check API rate limits
   - Review console errors

4. **Admin auth not working**
   - Clear sessionStorage
   - Check AdminLayout auth logic
   - Verify logout flow

---

## 📝 Development Scripts

```bash
# Development
pnpm dev              # Start dev server dengan Turbopack

# Build
pnpm build            # Build for production

# Start production
pnpm start            # Start production server

# Lint
pnpm lint             # Run ESLint
```

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'feat: add amazing feature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

### **Commit Convention**
- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation
- `style:` Styling changes
- `refactor:` Code refactoring
- `test:` Tests
- `chore:` Maintenance

---

## 📄 License

This project is private and not open for public use.

---

## 👨‍💻 Author

**Bayu Winata**
- GitHub: [@BayuWinataa](https://github.com/BayuWinataa)
- Repository: [ShopMate](https://github.com/BayuWinataa/ShopMate)

---

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/)
- [Supabase](https://supabase.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Groq AI](https://groq.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Radix UI](https://www.radix-ui.com/)

---

## 📞 Support

Untuk pertanyaan atau bantuan, silakan buka issue di GitHub repository.

---

**Built with ❤️ using Next.js, Supabase & AI**
