# Implementation Plan: Marketplace Multi-Vendor Ivet Mart

Transformasi Ivet Mart dari single-store (data hardcoded) menjadi **multi-vendor marketplace** dengan 3 role: **Admin**, **Penjual**, **Pembeli**.

---

## Keputusan Teknis

| Keputusan | Jawaban |
|---|---|
| Database | **PostgreSQL** (sudah ada docker-compose, schema.sql) |
| ORM | **Drizzle ORM** — type-safe, ringan, native Bun support |
| Auth | **better-auth** (sudah terinstal v1.5.6) + plugin `admin` & `organization` untuk role |
| UI Components | **Shadcn UI** (55 komponen sudah ada: sidebar, table, chart, form, dialog, dll) |
| Chart/Dashboard | **Recharts** (sudah terinstal v2.15.4) |
| Form | **react-hook-form** + **zod** (sudah terinstal) |
| Verifikasi Seller | Harus **di-approve Admin** sebelum bisa jualan |
| Payment | Sementara **transfer manual** (BCA dummy) — gateway nanti |
| Ongkir | Sementara **input manual** — API ongkir nanti |

---

## Library Baru yang Perlu Diinstal

```bash
bun add drizzle-orm postgres        # ORM + PostgreSQL driver
bun add -d drizzle-kit              # Migration tooling
```

> [!TIP]
> **Tidak perlu banyak library baru** — proyek sudah punya `better-auth`, `react-hook-form`, `zod`, `recharts`, dan 55 komponen Shadcn UI. Kita leverage semua ini.

---

## Arsitektur Keseluruhan

```mermaid
graph TB
    subgraph "Storefront (Pembeli)"
        A["Browse Produk"]
        B["Keranjang & Checkout"]
        C["Akun & Riwayat Pesanan"]
    end

    subgraph "Seller Dashboard"
        D["Register Toko"]
        E["CRUD Produk"]
        F["Kelola Pesanan"]
    end

    subgraph "Admin Panel"
        G["Dashboard Overview"]
        H["Verifikasi Seller"]
        I["Moderasi & Kategori"]
    end

    subgraph "Backend Layer"
        J["better-auth<br/>(role: buyer|seller|admin)"]
        K["Drizzle ORM<br/>(PostgreSQL queries)"]
        L["middleware.ts<br/>(route protection)"]
    end

    subgraph "Database"
        M["PostgreSQL<br/>users, seller_stores, products,<br/>orders, order_sellers, reviews"]
    end

    A & B & C --> J
    D & E & F --> J
    G & H & I --> J
    J --> L --> K --> M
```

---

## Fase 1: Database & ORM Setup (2-3 hari)

> Setup fondasi database — semua fase selanjutnya bergantung pada ini.

### 1.1 Install Dependencies

```bash
bun add drizzle-orm postgres
bun add -d drizzle-kit
```

### 1.2 Konfigurasi Database

#### [NEW] `lib/db.ts`

Koneksi database PostgreSQL menggunakan `postgres` driver + Drizzle ORM.

```typescript
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./db/schema";

const connectionString = process.env.DATABASE_URL!;
const client = postgres(connectionString);
export const db = drizzle(client, { schema });
```

#### [NEW] `drizzle.config.ts`

```typescript
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./lib/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
```

### 1.3 Skema Drizzle ORM (Type-Safe)

#### [NEW] `lib/db/schema.ts`

Semua tabel dalam Drizzle schema definition:

```typescript
import {
  pgTable, pgEnum, uuid, varchar, text, boolean,
  integer, bigint, timestamp, jsonb, primaryKey, decimal,
} from "drizzle-orm/pg-core";

// ═══ ENUMS ═══
export const userRoleEnum = pgEnum("user_role", ["buyer", "seller", "admin"]);
export const userStatusEnum = pgEnum("user_status", ["active", "suspended", "pending_verification"]);
export const storeStatusEnum = pgEnum("store_status", ["pending", "active", "suspended", "rejected"]);
export const orderStatusEnum = pgEnum("order_status", [
  "pending_payment", "paid", "processing", "shipped",
  "delivered", "completed", "cancelled", "refunded",
]);

// ═══ USERS ═══
export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: varchar("email", { length: 255 }).unique().notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  passwordHash: text("password_hash").notNull(),
  phone: varchar("phone", { length: 20 }),
  avatarUrl: text("avatar_url"),
  role: userRoleEnum("role").notNull().default("buyer"),
  status: userStatusEnum("status").notNull().default("active"),
  emailVerifiedAt: timestamp("email_verified_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// ═══ SELLER STORES ═══
export const sellerStores = pgTable("seller_stores", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }).unique(),
  name: varchar("name", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).unique().notNull(),
  description: text("description"),
  logoUrl: text("logo_url"),
  bannerUrl: text("banner_url"),
  address: text("address"),
  city: varchar("city", { length: 100 }),
  province: varchar("province", { length: 100 }),
  postalCode: varchar("postal_code", { length: 10 }),
  phone: varchar("phone", { length: 20 }),
  status: storeStatusEnum("status").notNull().default("pending"),
  verifiedAt: timestamp("verified_at"),
  ratingAvg: decimal("rating_avg", { precision: 3, scale: 2 }).default("0"),
  totalSales: integer("total_sales").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// ═══ CATEGORIES ═══
export const categories = pgTable("categories", {
  id: varchar("id", { length: 50 }).primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).unique().notNull(),
  description: text("description"),
  active: boolean("active").default(true),
  image: text("image"),
  createdAt: timestamp("created_at").defaultNow(),
});

// ═══ PRODUCTS (+ seller_store_id) ═══
export const products = pgTable("products", {
  id: varchar("id", { length: 50 }).primaryKey(),
  sellerStoreId: uuid("seller_store_id").references(() => sellerStores.id),
  name: varchar("name", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).unique().notNull(),
  description: text("description"),
  summary: text("summary"),
  categoryId: varchar("category_id", { length: 50 }).references(() => categories.id),
  images: jsonb("images").default([]),
  active: boolean("active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// ═══ VARIANTS ═══
export const variants = pgTable("variants", {
  id: varchar("id", { length: 50 }).primaryKey(),
  productId: varchar("product_id", { length: 50 }).references(() => products.id, { onDelete: "cascade" }),
  name: varchar("name", { length: 255 }),
  price: bigint("price", { mode: "number" }).notNull(),
  stock: integer("stock").default(0),
  images: jsonb("images").default([]),
  attributes: jsonb("attributes").default({}),
});

// ═══ COLLECTIONS ═══
export const collections = pgTable("collections", {
  id: varchar("id", { length: 50 }).primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).unique().notNull(),
  description: text("description"),
  active: boolean("active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const productCollections = pgTable("product_collections", {
  productId: varchar("product_id", { length: 50 }).references(() => products.id, { onDelete: "cascade" }),
  collectionId: varchar("collection_id", { length: 50 }).references(() => collections.id, { onDelete: "cascade" }),
}, (t) => [primaryKey({ columns: [t.productId, t.collectionId] })]);

// ═══ ADDRESSES ═══
export const addresses = pgTable("addresses", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }),
  label: varchar("label", { length: 50 }).notNull(),
  recipientName: varchar("recipient_name", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 20 }).notNull(),
  addressLine: text("address_line").notNull(),
  city: varchar("city", { length: 100 }),
  province: varchar("province", { length: 100 }),
  postalCode: varchar("postal_code", { length: 10 }),
  isDefault: boolean("is_default").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// ═══ CARTS (user-linked) ═══
export const carts = pgTable("carts", {
  id: varchar("id", { length: 100 }).primaryKey(),
  userId: uuid("user_id").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const cartItems = pgTable("cart_items", {
  id: uuid("id").primaryKey().defaultRandom(),
  cartId: varchar("cart_id", { length: 100 }).references(() => carts.id, { onDelete: "cascade" }),
  variantId: varchar("variant_id", { length: 50 }).references(() => variants.id),
  quantity: integer("quantity").notNull().default(1),
});

// ═══ ORDERS (multi-seller) ═══
export const orders = pgTable("orders", {
  id: uuid("id").primaryKey().defaultRandom(),
  buyerId: uuid("buyer_id").references(() => users.id),
  addressId: uuid("address_id").references(() => addresses.id),
  totalAmount: bigint("total_amount", { mode: "number" }).notNull(),
  paymentMethod: varchar("payment_method", { length: 50 }),
  paymentStatus: varchar("payment_status", { length: 50 }).default("unpaid"),
  paymentReference: text("payment_reference"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Sub-order per penjual
export const orderSellers = pgTable("order_sellers", {
  id: uuid("id").primaryKey().defaultRandom(),
  orderId: uuid("order_id").references(() => orders.id, { onDelete: "cascade" }),
  sellerStoreId: uuid("seller_store_id").references(() => sellerStores.id),
  subtotal: bigint("subtotal", { mode: "number" }).notNull(),
  shippingCost: bigint("shipping_cost", { mode: "number" }).default(0),
  shippingMethod: varchar("shipping_method", { length: 100 }),
  trackingNumber: varchar("tracking_number", { length: 255 }),
  status: orderStatusEnum("status").notNull().default("pending_payment"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const orderItems = pgTable("order_items", {
  id: uuid("id").primaryKey().defaultRandom(),
  orderSellerId: uuid("order_seller_id").references(() => orderSellers.id, { onDelete: "cascade" }),
  variantId: varchar("variant_id", { length: 50 }).references(() => variants.id),
  productName: varchar("product_name", { length: 255 }),
  variantName: varchar("variant_name", { length: 255 }),
  quantity: integer("quantity").notNull(),
  price: bigint("price", { mode: "number" }).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// ═══ REVIEWS ═══
export const reviews = pgTable("reviews", {
  id: uuid("id").primaryKey().defaultRandom(),
  productId: varchar("product_id", { length: 50 }).references(() => products.id, { onDelete: "cascade" }),
  userId: uuid("user_id").references(() => users.id),
  orderItemId: uuid("order_item_id").references(() => orderItems.id),
  rating: integer("rating").notNull(),
  comment: text("comment"),
  images: jsonb("images").default([]),
  createdAt: timestamp("created_at").defaultNow(),
});

// ═══ WISHLISTS ═══
export const wishlists = pgTable("wishlists", {
  userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }),
  productId: varchar("product_id", { length: 50 }).references(() => products.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").defaultNow(),
}, (t) => [primaryKey({ columns: [t.userId, t.productId] })]);

// ═══ PLATFORM SETTINGS ═══
export const platformSettings = pgTable("platform_settings", {
  key: varchar("key", { length: 100 }).primaryKey(),
  value: jsonb("value").notNull(),
  updatedAt: timestamp("updated_at").defaultNow(),
});
```

### 1.4 Docker Compose Update

#### [MODIFY] [docker-compose.yml](file:///Users/mymac/Documents/Codes/ivetmart/docker-compose.yml)

Tambah service PostgreSQL:

```yaml
services:
  db:
    image: postgres:16-alpine
    container_name: ivetmart-db
    restart: always
    environment:
      POSTGRES_DB: ivetmart
      POSTGRES_USER: ivetmart
      POSTGRES_PASSWORD: ivetmart_dev_2026
    ports:
      - "5432:5432"
    volumes:
      - pgdata:/var/lib/postgresql/data

  ivetmart-web:
    # ... existing config ...
    environment:
      - DATABASE_URL=postgresql://ivetmart:ivetmart_dev_2026@db:5432/ivetmart
    depends_on:
      - db

volumes:
  pgdata:
```

### 1.5 Environment Variables

#### [MODIFY] `.env.example` & `.env.local`

```env
DATABASE_URL=postgresql://ivetmart:ivetmart_dev_2026@localhost:5432/ivetmart
BETTER_AUTH_SECRET=<random-32-char-secret>
BETTER_AUTH_URL=http://localhost:3000
```

### 1.6 Migration & Seed Scripts

#### [NEW] `package.json` scripts tambahan

```json
{
  "scripts": {
    "db:generate": "drizzle-kit generate",
    "db:migrate": "drizzle-kit migrate",
    "db:push": "drizzle-kit push",
    "db:seed": "bun run lib/db/seed.ts",
    "db:studio": "drizzle-kit studio"
  }
}
```

#### [NEW] `lib/db/seed.ts`

Seed data awal: admin user, kategori, dan beberapa produk demo.

```typescript
// Seeds:
// 1. Admin user (admin@ivetmart.com / admin123)
// 2. Demo seller user + store (verified)
// 3. Demo buyer user
// 4. Existing categories (kuliner, fashion, merch)
// 5. Existing products (lumpia, batik, dll)
```

### ✅ Checklist Fase 1

- [ ] `bun add drizzle-orm postgres && bun add -d drizzle-kit`
- [ ] Buat `lib/db.ts`, `lib/db/schema.ts`, `drizzle.config.ts`
- [ ] Update `docker-compose.yml` + `.env.local`
- [ ] `docker compose up db` → PostgreSQL running
- [ ] `bun run db:push` → tabel terbuat
- [ ] `bun run db:seed` → data awal masuk
- [ ] `bun run db:studio` → bisa lihat data di browser

---

## Fase 2: Auth & Role System (2-3 hari)

> Setup `better-auth` agar mendukung 3 role, lalu proteksi rute berdasarkan role.

### 2.1 Konfigurasi better-auth Server

#### [MODIFY] [auth-config.ts](file:///Users/mymac/Documents/Codes/ivetmart/lib/auth-config.ts)

```typescript
export const AUTH_ENABLED = true; // Aktifkan auth
```

#### [NEW] `lib/auth-server.ts`

Konfigurasi `better-auth` server instance dengan Drizzle adapter:

```typescript
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { admin } from "better-auth/plugins";
import { db } from "./db";

export const auth = betterAuth({
  database: drizzleAdapter(db, { provider: "pg" }),
  emailAndPassword: { enabled: true },
  plugins: [
    admin(), // Adds role field + admin endpoints
  ],
  user: {
    additionalFields: {
      role: { type: "string", default: "buyer" },
      phone: { type: "string", optional: true },
    },
  },
});
```

> [!TIP]
> `better-auth` punya plugin `admin()` bawaan yang menambah field `role` ke user dan endpoint admin (ban user, list users, dll). Kita leverage ini agar tidak perlu bikin dari nol.

### 2.2 Auth Client Update

#### [MODIFY] [auth-client.ts](file:///Users/mymac/Documents/Codes/ivetmart/lib/auth-client.ts)

```typescript
"use client";
import { createAuthClient } from "better-auth/react";
import { adminClient } from "better-auth/client/plugins";

export const authClient = createAuthClient({
  plugins: [adminClient()],
});

export const { useSession, signIn, signUp, signOut } = authClient;
```

### 2.3 Auth API Route

#### [MODIFY] [route.ts](file:///Users/mymac/Documents/Codes/ivetmart/app/api/auth/%5B...all%5D/route.ts)

Ubah dari proxy ke local better-auth handler:

```typescript
import { auth } from "@/lib/auth-server";
import { toNextJsHandler } from "better-auth/next-js";

export const { GET, POST } = toNextJsHandler(auth);
```

### 2.4 Middleware Route Protection

#### [MODIFY] [proxy.ts](file:///Users/mymac/Documents/Codes/ivetmart/proxy.ts) → refactor jadi `middleware.ts`

```typescript
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const sessionToken = request.cookies.get("better-auth.session_token");
  const path = request.nextUrl.pathname;

  // Public routes — no auth needed
  if (path.startsWith("/login") || path.startsWith("/signup")) {
    if (sessionToken) {
      return NextResponse.redirect(new URL("/", request.url));
    }
    return NextResponse.next();
  }

  // Protected routes — auth required
  const protectedPrefixes = ["/account", "/seller", "/admin"];
  const isProtected = protectedPrefixes.some((p) => path.startsWith(p));

  if (isProtected && !sessionToken) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", path);
    return NextResponse.redirect(loginUrl);
  }

  // Role-based protection is done server-side in layouts
  // (middleware can't easily decode JWT without crypto)
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/account/:path*",
    "/seller/:path*",
    "/admin/:path*",
    "/login",
    "/signup",
  ],
};
```

### 2.5 Server-Side Role Guards (di Layout)

#### [NEW] `lib/auth-guard.ts`

```typescript
import { redirect } from "next/navigation";
import { getSession } from "./auth";

export async function requireAuth() {
  const session = await getSession();
  if (!session) redirect("/login");
  return session;
}

export async function requireRole(role: "buyer" | "seller" | "admin") {
  const session = await requireAuth();
  if (session.user.role !== role) redirect("/");
  return session;
}

export async function requireSeller() {
  return requireRole("seller");
}

export async function requireAdmin() {
  return requireRole("admin");
}
```

### 2.6 Update Signup Form (Pilih Role)

#### [MODIFY] [signup-form.tsx](file:///Users/mymac/Documents/Codes/ivetmart/app/%28auth%29/signup/signup-form.tsx)

Tambah opsi "Daftar sebagai Pembeli" atau "Daftar sebagai Penjual" (radio button / tabs).

### 2.7 Update Login Form

#### [MODIFY] [login-form.tsx](file:///Users/mymac/Documents/Codes/ivetmart/app/%28auth%29/login/login-form.tsx)

Setelah login berhasil, redirect berdasarkan role:
- `buyer` → `/`
- `seller` → `/seller`
- `admin` → `/admin`

### ✅ Checklist Fase 2

- [ ] `better-auth` dikonfigurasi dengan Drizzle adapter
- [ ] Plugin `admin()` aktif → field `role` tersedia
- [ ] Auth API route pakai local handler (bukan proxy)
- [ ] Middleware memproteksi `/account`, `/seller`, `/admin`
- [ ] Layout guard memvalidasi role server-side
- [ ] Signup form bisa pilih buyer/seller
- [ ] Login redirect sesuai role
- [ ] Test: buyer tidak bisa akses `/admin`, seller tidak bisa akses `/admin`

---

## Fase 3: Refactor Data Layer (2-3 hari)

> Ganti data hardcoded di `commerce.ts` dengan query Drizzle ke PostgreSQL.

### 3.1 Refactor commerce.ts

#### [MODIFY] [commerce.ts](file:///Users/mymac/Documents/Codes/ivetmart/lib/commerce.ts)

**Sebelum:** 616 baris data hardcoded + in-memory cart.
**Sesudah:** Query ke PostgreSQL via Drizzle ORM.

Fungsi-fungsi yang perlu di-refactor:

| Method | Sebelum | Sesudah |
|---|---|---|
| `productBrowse` | Filter array `PRODUCTS` | `db.select().from(products).innerJoin(sellerStores)` + filter |
| `productGet` | `PRODUCTS.find()` | `db.query.products.findFirst({ where: eq(slug) })` |
| `categoriesBrowse` | Return array `CATEGORIES` | `db.select().from(categories)` |
| `cartGet` | Read `LOCAL_CARTS` object | `db.select().from(cartItems).where(cartId)` |
| `cartUpsert` | Mutate `LOCAL_CARTS` object | `db.insert(cartItems).onConflictDoUpdate()` |
| `search` | Filter array | `ilike()` query on products + categories |
| `productReviewsBrowse` | Return empty | `db.select().from(reviews).where(productId)` |

### 3.2 Tambah Seller Info ke Product Response

Setiap produk sekarang punya info toko penjual:

```typescript
// Response product sekarang include:
{
  id, name, slug, description, images, variants,
  category: { id, name, slug },
  seller: { id, name, slug, logoUrl, ratingAvg },  // ← BARU
}
```

### 3.3 Seller-Specific Query Functions

#### [NEW] `lib/db/queries/seller.ts`

```typescript
// getSellerProducts(storeId) — produk milik seller tertentu
// getSellerOrders(storeId) — pesanan yang masuk ke seller
// getSellerStats(storeId) — statistik penjualan seller
// updateOrderSellerStatus(id, status) — update status sub-order
```

#### [NEW] `lib/db/queries/admin.ts`

```typescript
// getAllUsers(filters) — list semua user dengan pagination
// getPendingSellers() — seller yang menunggu verifikasi
// approveSellerStore(storeId) — approve toko seller
// rejectSellerStore(storeId, reason) — reject toko seller
// getDashboardStats() — total user, seller, orders, revenue
```

#### [NEW] `lib/db/queries/buyer.ts`

```typescript
// getUserOrders(userId) — riwayat pesanan pembeli
// getUserAddresses(userId) — daftar alamat
// createAddress(userId, data) — tambah alamat
// getUserWishlist(userId) — wishlist
// toggleWishlist(userId, productId) — toggle wishlist
```

### ✅ Checklist Fase 3

- [ ] Semua method di `commerce.ts` baca dari database
- [ ] Data hardcoded (`PRODUCTS`, `CATEGORIES`, dll) dihapus
- [ ] `LOCAL_CARTS` in-memory diganti `carts` + `cart_items` table
- [ ] Product response include `seller` info
- [ ] Storefront (`/products`, `/product/[slug]`, `/search`) tetap berfungsi normal
- [ ] `bun dev` → browse produk, add to cart, search — semua jalan

---

## Fase 4: Seller Dashboard (3-4 hari)

> Dashboard untuk penjual: register toko, kelola produk, kelola pesanan.

### 4.1 Layout & Navigation

#### [NEW] `app/seller/layout.tsx`

Dashboard layout dengan sidebar navigasi (menggunakan komponen `Sidebar` Shadcn yang sudah ada di [sidebar.tsx](file:///Users/mymac/Documents/Codes/ivetmart/components/ui/sidebar.tsx)):

```
Sidebar items:
├── 📊 Dashboard       → /seller
├── 📦 Produk Saya     → /seller/products
├── 🛒 Pesanan         → /seller/orders
├── 💰 Keuangan        → /seller/finance
├── ⚙️ Pengaturan Toko → /seller/settings
```

Server-side guard: `requireSeller()` di layout — redirect non-seller ke homepage.

### 4.2 Registrasi Toko

#### [NEW] `app/seller/register/page.tsx`

Form registrasi toko (hanya untuk user dengan role `seller` yang belum punya toko):
- Nama toko
- Slug (auto-generate dari nama)
- Deskripsi
- Upload logo
- Alamat toko (kota, provinsi, kode pos)
- Nomor telepon

Setelah submit → status `pending` → menunggu approval Admin.

#### [NEW] `app/seller/pending/page.tsx`

Halaman "Toko Anda sedang dalam proses verifikasi" — tampil jika status `pending`.

### 4.3 Dashboard Utama

#### [NEW] `app/seller/page.tsx`

Dashboard statistik penjual (menggunakan [chart.tsx](file:///Users/mymac/Documents/Codes/ivetmart/components/ui/chart.tsx) Recharts):

| Widget | Data |
|---|---|
| Stat Card: Total Produk | `COUNT(products WHERE seller_store_id = me)` |
| Stat Card: Pesanan Masuk | `COUNT(order_sellers WHERE seller_store_id = me AND status IN (...))` |
| Stat Card: Pendapatan Bulan Ini | `SUM(subtotal) this month` |
| Chart: Penjualan 7 Hari | Line chart Recharts |
| Tabel: Pesanan Terbaru | 5 pesanan terakhir |

### 4.4 CRUD Produk

#### [NEW] `app/seller/products/page.tsx`

Tabel daftar produk penjual (menggunakan [table.tsx](file:///Users/mymac/Documents/Codes/ivetmart/components/ui/table.tsx)):
- Kolom: Gambar, Nama, Kategori, Harga, Stok, Status, Aksi
- Aksi: Edit, Hapus (confirm dialog), Toggle aktif/nonaktif
- Search & filter
- Pagination

#### [NEW] `app/seller/products/new/page.tsx`
#### [NEW] `app/seller/products/[id]/edit/page.tsx`

Form produk (menggunakan `react-hook-form` + `zod` validation):

| Field | Type | Validasi |
|---|---|---|
| Nama produk | Text input | Required, max 255 char |
| Slug | Text input (auto-generate) | Unique |
| Deskripsi | Textarea / TipTap editor | Required |
| Ringkasan | Textarea | Optional |
| Kategori | Select dropdown | Required |
| Gambar | Multi-image upload | Min 1 gambar |
| **Varian** (repeater) | — | Min 1 varian |
| ├── Nama varian | Text input | Required |
| ├── Harga | Number input | Required, min 0 |
| ├── Stok | Number input | Required, min 0 |
| └── Atribut | Key-value pairs | Optional |

#### [NEW] `app/seller/products/actions.ts`

Server Actions untuk CRUD produk:

```typescript
"use server";
// createProduct(formData) — insert products + variants
// updateProduct(id, formData) — update products + variants
// deleteProduct(id) — soft delete (active = false)
// toggleProductActive(id) — toggle active status
```

### 4.5 Kelola Pesanan

#### [NEW] `app/seller/orders/page.tsx`

Tabel pesanan masuk (filter by status):
- Tab: Semua | Baru | Diproses | Dikirim | Selesai
- Kolom: ID, Pembeli, Produk, Total, Status, Tanggal, Aksi

#### [NEW] `app/seller/orders/[id]/page.tsx`

Detail pesanan:
- Info pembeli & alamat pengiriman
- Daftar item pesanan
- Status timeline
- Form input resi (jika status = `processing`)
- Tombol update status: Proses → Kirim (+ input resi) → Selesai

### 4.6 Pengaturan Toko

#### [NEW] `app/seller/settings/page.tsx`

Edit profil toko:
- Nama, deskripsi, logo, banner
- Alamat, kota, provinsi
- Nomor telepon

### ✅ Checklist Fase 4

- [ ] Seller bisa register toko → status `pending`
- [ ] Seller melihat halaman "menunggu verifikasi" saat pending
- [ ] Seller yang di-approve bisa akses dashboard
- [ ] Seller bisa CRUD produk + varian
- [ ] Seller bisa lihat pesanan masuk + update status + input resi
- [ ] Dashboard statistik tampil dengan benar
- [ ] Responsive di mobile

---

## Fase 5: Admin Panel (3-4 hari)

> Panel admin untuk mengelola platform: verifikasi seller, moderasi, statistik.

### 5.1 Layout & Navigation

#### [NEW] `app/admin/layout.tsx`

Dashboard layout (juga pakai Sidebar Shadcn), server guard `requireAdmin()`:

```
Sidebar items:
├── 📊 Dashboard        → /admin
├── 👥 Pengguna         → /admin/users
├── 🏪 Penjual          → /admin/sellers
├── 📦 Produk           → /admin/products
├── 🛒 Pesanan          → /admin/orders
├── 📂 Kategori         → /admin/categories
├── ⚙️ Pengaturan       → /admin/settings
```

### 5.2 Dashboard Overview

#### [NEW] `app/admin/page.tsx`

| Widget | Data |
|---|---|
| Stat Card: Total Pengguna | `COUNT(users)` |
| Stat Card: Total Penjual (Aktif) | `COUNT(seller_stores WHERE status = active)` |
| Stat Card: Total Pesanan | `COUNT(orders)` |
| Stat Card: Pendapatan Total | `SUM(orders.total_amount)` |
| Chart: Pendapatan 30 Hari | Area chart Recharts |
| Chart: Registrasi User 30 Hari | Bar chart |
| Tabel: Seller Pending Approval | List toko menunggu verifikasi |
| Tabel: Pesanan Terbaru | 10 pesanan terakhir |

### 5.3 Kelola Pengguna

#### [NEW] `app/admin/users/page.tsx`

Tabel semua user:
- Kolom: Avatar, Nama, Email, Role, Status, Tgl Daftar, Aksi
- Filter: by role (buyer/seller/admin), by status
- Aksi: Lihat detail, Suspend/Aktifkan, Ubah role (promote ke admin)
- Search by name/email

### 5.4 Verifikasi Penjual

#### [NEW] `app/admin/sellers/page.tsx`

Daftar toko penjual dengan tab status:
- Tab: Menunggu Verifikasi | Aktif | Ditangguhkan | Ditolak
- Fokus utama: list `pending` yang butuh di-approve

#### [NEW] `app/admin/sellers/[id]/page.tsx`

Detail toko penjual:
- Info toko (nama, alamat, deskripsi, logo)
- Statistik: total produk, total pesanan, pendapatan
- Daftar produk yang dijual
- Tombol: **Approve** / **Reject** (dengan alasan) / **Suspend**

#### [NEW] `app/admin/sellers/actions.ts`

```typescript
"use server";
// approveStore(storeId) — set status = 'active', verifiedAt = now()
// rejectStore(storeId, reason) — set status = 'rejected'
// suspendStore(storeId, reason) — set status = 'suspended'
```

### 5.5 Moderasi Produk

#### [NEW] `app/admin/products/page.tsx`

Tabel semua produk dari semua seller:
- Kolom: Gambar, Nama, Penjual, Kategori, Harga, Status, Aksi
- Aksi: Lihat, Nonaktifkan (takedown), Aktifkan kembali
- Filter: by kategori, by seller, by status

### 5.6 Kelola Pesanan

#### [NEW] `app/admin/orders/page.tsx`

Tabel semua pesanan (read-only, untuk monitoring/mediasi):
- Kolom: ID, Pembeli, Penjual, Total, Status, Tanggal
- Filter: by status, by date range

### 5.7 Kelola Kategori

#### [NEW] `app/admin/categories/page.tsx`

CRUD kategori produk:
- Tabel: Nama, Slug, Deskripsi, Jumlah Produk, Aksi
- Dialog form untuk tambah/edit kategori
- Tombol hapus (dengan konfirmasi, hanya jika tidak ada produk terkait)

### 5.8 Pengaturan Platform

#### [NEW] `app/admin/settings/page.tsx`

Pengaturan marketplace:
- Nama toko / announcement bar
- Logo & favicon
- Pengaturan fitur (blog, newsletter, contact form)
- **(Nanti)** Komisi rate, payment gateway config

### ✅ Checklist Fase 5

- [ ] Admin bisa login dan akses `/admin`
- [ ] Dashboard overview menampilkan statistik real
- [ ] Admin bisa approve/reject/suspend seller
- [ ] Admin bisa lihat & moderasi semua produk
- [ ] Admin bisa CRUD kategori
- [ ] Admin bisa lihat semua pesanan
- [ ] Admin bisa suspend/aktifkan user
- [ ] Non-admin redirect ke homepage jika akses `/admin`

---

## Fase 6: Buyer Account & Checkout (2-3 hari)

> Area akun pembeli: profil, alamat, pesanan, wishlist, dan flow checkout.

### 6.1 Account Area

#### [NEW] `app/account/layout.tsx`

Layout akun pembeli (sidebar atau tab navigation):

```
├── 👤 Profil           → /account
├── 📦 Pesanan Saya     → /account/orders
├── 📍 Alamat           → /account/addresses
├── ❤️ Wishlist          → /account/wishlist
├── ⚙️ Pengaturan       → /account/settings
```

#### [NEW] `app/account/page.tsx`

Profil user: nama, email, foto, tanggal bergabung.

#### [NEW] `app/account/orders/page.tsx`

Riwayat pesanan pembeli:
- Status per sub-order (per seller)
- Link ke detail pesanan

#### [NEW] `app/account/orders/[id]/page.tsx`

Detail pesanan:
- Item yang dipesan (per seller)
- Status timeline per seller
- Nomor resi (jika sudah dikirim)
- Tombol "Pesanan Diterima" (confirm delivery → status `completed`)
- Tombol "Beri Review" (setelah completed)

#### [NEW] `app/account/addresses/page.tsx`

CRUD alamat pengiriman:
- List alamat (label, nama penerima, alamat lengkap)
- Tandai alamat default
- Tambah / edit / hapus alamat

#### [NEW] `app/account/wishlist/page.tsx`

Grid produk yang di-wishlist:
- Card produk dengan tombol "Hapus dari wishlist"
- Klik → ke halaman produk

### 6.2 Checkout Flow (Transfer Manual)

#### [MODIFY] Cart → Checkout flow

Saat ini checkout di-proxy ke backend YNS. Kita ganti dengan flow lokal:

```
Cart → Pilih Alamat → Ringkasan (dikelompokkan per Seller) → Konfirmasi
→ Buat Order → Tampilkan Info Transfer Manual (BCA) → Selesai
```

#### [NEW] `app/checkout/page.tsx` (local, bukan proxy)

Step-by-step checkout:
1. **Pilih alamat** — dropdown alamat yang sudah disimpan, atau tambah baru
2. **Ringkasan** — item dikelompokkan per seller, subtotal per seller, total keseluruhan
3. **Konfirmasi & Bayar** — tampilkan info transfer manual:
   ```
   Bank BCA
   No. Rekening: 0961166321
   Total: Rp xxx.xxx
   ```
4. **Order dibuat** → redirect ke `/account/orders/[id]`

#### [NEW] `app/checkout/actions.ts`

```typescript
"use server";
// createOrder(buyerId, addressId, cartId) →
//   1. Buat master order
//   2. Group cart items by seller → buat order_sellers per seller
//   3. Buat order_items per item
//   4. Kurangi stok variant
//   5. Kosongkan cart
//   6. Return orderId
```

### 6.3 Wishlist Button di Product Page

#### [MODIFY] Product card & product detail page

Tambah tombol ❤️ wishlist:
- User login → toggle wishlist via Server Action
- User belum login → redirect ke login

### 6.4 Review Produk

#### [NEW] Review form di `app/account/orders/[id]/page.tsx`

Setelah order status `completed`:
- Rating (1-5 bintang)
- Komentar
- Upload gambar (optional)

#### [MODIFY] Product detail page

Tampilkan daftar review di halaman produk (nama reviewer, rating, komentar, tanggal).

### ✅ Checklist Fase 6

- [ ] Pembeli bisa lihat profil, edit nama/foto
- [ ] Pembeli bisa CRUD alamat pengiriman
- [ ] Checkout flow berjalan: pilih alamat → ringkasan → info transfer
- [ ] Order terbuat di database, dikelompokkan per seller
- [ ] Stok berkurang setelah order dibuat
- [ ] Pembeli bisa lihat riwayat pesanan + detail + tracking
- [ ] Pembeli bisa confirm delivery → status `completed`
- [ ] Pembeli bisa beri review setelah order selesai
- [ ] Wishlist toggle berfungsi

---

## Fase 7: Halaman Publik Toko Seller & Polish (2 hari)

> Halaman publik toko penjual + polishing.

### 7.1 Halaman Toko Penjual (Publik)

#### [NEW] `app/store/[slug]/page.tsx`

Halaman publik toko penjual yang bisa diakses siapa saja:
- Banner & logo toko
- Nama, deskripsi, rating, total produk
- Badge "Verified Seller" ✅
- Grid produk dari seller tersebut
- Pagination

### 7.2 Seller Badge di Product Card

#### [MODIFY] [product-card.tsx](file:///Users/mymac/Documents/Codes/ivetmart/components/product-card.tsx)

Tambah nama toko penjual + link ke `/store/[slug]` di bawah nama produk.

### 7.3 Polish & Responsive

- [ ] Semua dashboard responsive di mobile (sidebar collapse ke hamburger)
- [ ] Loading states (skeleton) di semua tabel dan form
- [ ] Toast notifications (pakai `sonner` yang sudah terinstal)
- [ ] Error handling konsisten (pakai `safe-try`)
- [ ] Teks di-Indonesiakan (label, placeholder, error message)

### ✅ Checklist Fase 7

- [ ] Halaman toko penjual publik tampil dengan benar
- [ ] Product card menampilkan info seller
- [ ] Semua halaman responsive
- [ ] Loading & error states ada di semua halaman
- [ ] `bun run build` → build sukses
- [ ] `bun run lint` → no errors
- [ ] `bun dev` → full flow berjalan (register → login → jualan → beli → review)

---

## Ringkasan File yang Dibuat/Dimodifikasi

### File Baru (~30+ file)

| File | Fungsi |
|---|---|
| `lib/db.ts` | Koneksi database |
| `lib/db/schema.ts` | Drizzle schema (semua tabel) |
| `lib/db/seed.ts` | Seed data awal |
| `lib/auth-server.ts` | better-auth server config |
| `lib/auth-guard.ts` | Role guard helpers |
| `lib/db/queries/seller.ts` | Query penjual |
| `lib/db/queries/admin.ts` | Query admin |
| `lib/db/queries/buyer.ts` | Query pembeli |
| `drizzle.config.ts` | Drizzle Kit config |
| `app/seller/layout.tsx` | Seller dashboard layout |
| `app/seller/page.tsx` | Seller dashboard home |
| `app/seller/register/page.tsx` | Register toko |
| `app/seller/products/page.tsx` | List produk seller |
| `app/seller/products/new/page.tsx` | Tambah produk |
| `app/seller/products/[id]/edit/page.tsx` | Edit produk |
| `app/seller/products/actions.ts` | Server actions produk |
| `app/seller/orders/page.tsx` | Pesanan masuk |
| `app/seller/orders/[id]/page.tsx` | Detail pesanan + resi |
| `app/seller/settings/page.tsx` | Pengaturan toko |
| `app/admin/layout.tsx` | Admin panel layout |
| `app/admin/page.tsx` | Admin dashboard |
| `app/admin/users/page.tsx` | Kelola user |
| `app/admin/sellers/page.tsx` | Kelola seller |
| `app/admin/sellers/[id]/page.tsx` | Detail seller |
| `app/admin/sellers/actions.ts` | Server actions verifikasi |
| `app/admin/products/page.tsx` | Moderasi produk |
| `app/admin/orders/page.tsx` | Semua pesanan |
| `app/admin/categories/page.tsx` | CRUD kategori |
| `app/admin/settings/page.tsx` | Pengaturan platform |
| `app/account/layout.tsx` | Account area layout |
| `app/account/page.tsx` | Profil |
| `app/account/orders/page.tsx` | Riwayat pesanan |
| `app/account/orders/[id]/page.tsx` | Detail pesanan |
| `app/account/addresses/page.tsx` | Kelola alamat |
| `app/account/wishlist/page.tsx` | Wishlist |
| `app/checkout/page.tsx` | Checkout flow lokal |
| `app/checkout/actions.ts` | Server actions checkout |
| `app/store/[slug]/page.tsx` | Halaman toko publik |

### File Dimodifikasi (~8 file)

| File | Perubahan |
|---|---|
| `lib/commerce.ts` | Refactor total: hardcode → DB query |
| `lib/auth-config.ts` | `AUTH_ENABLED = true` |
| `lib/auth-client.ts` | Tambah admin plugin |
| `app/api/auth/[...all]/route.ts` | Local handler (bukan proxy) |
| `proxy.ts` → `middleware.ts` | Route protection by role |
| `docker-compose.yml` | Tambah PostgreSQL service |
| `.env.example` | Tambah DATABASE_URL, BETTER_AUTH_SECRET |
| `components/product-card.tsx` | Tambah seller info |

---

## Verification Plan

### Per-Fase Testing

```bash
# Setelah setiap fase:
bun run lint           # Biome lint
tsgo --noEmit          # Type check
bun run build          # Build succeeds
bun dev                # Dev server runs
```

### End-to-End Manual Flow

1. **Buyer signup** → role buyer → browse → add to cart → checkout → order created
2. **Seller signup** → role seller → register toko → status pending
3. **Admin login** → approve seller → seller toko aktif
4. **Seller login** → add produk → produk muncul di storefront
5. **Buyer order** → seller lihat pesanan → proses → input resi → kirim
6. **Buyer confirm** → pesanan selesai → beri review
7. **Admin monitor** → lihat semua statistik, moderasi produk
