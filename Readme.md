# 🌾 FreshFarm - Hệ Thống E-commerce Nông Sản (Buyer & Admin)

## 📋 Tổng Quan Dự Án

**FreshFarm** là một ứng dụng thương mại điện tử chuyên cung cấp **nông sản tươi sạch**, được xây dựng bằng **Next.js + MongoDB + Prisma**, tập trung vào trải nghiệm mua sắm đơn giản, nhanh chóng và quản lý hệ thống hiệu quả.

Hệ thống **chỉ bao gồm 2 vai trò**:

* **Buyer (User / Khách hàng)**
* **Admin (Quản trị viên)** 

---

## 🎯 Mục Tiêu Sản Phẩm

### 👤 Đối Tượng Sử Dụng

* **Buyer (User)**

  * Mua nông sản online
  * Quản lý giỏ hàng & đơn hàng
  * Đặt giao hàng định kỳ
  * Đánh giá sản phẩm
  * Quản lý địa chỉ giao hàng, wishlist

* **Admin**

  * Quản lý toàn bộ hệ thống
  * Quản lý sản phẩm & danh mục
  * Quản lý đơn hàng & đơn giao định kỳ
  * Quản lý người dùng
  * Quản lý coupon, đánh giá, cảnh báo
  * Xem thống kê hệ thống

### ✅ Vấn Đề Giải Quyết

* Minh bạch thông tin nông sản (giống, mùa vụ, chứng nhận)
* Đặt hàng nhanh, hỗ trợ giao hàng 2H
* Thanh toán linh hoạt (COD, VietQR)
* Theo dõi đơn hàng rõ ràng, tra cứu không cần đăng nhập
* Hệ thống quản trị tập trung, dễ kiểm soát chất lượng

---

## 📌 Phạm Vi Dự Án

### In-Scope

* Quản lý sản phẩm & danh mục (Admin)
* Giỏ hàng & checkout
* Quản lý đơn hàng
* Theo dõi đơn hàng
* Đơn hàng giao định kỳ (Recurring Orders)
* Đánh giá & rating sản phẩm
* Wishlist
* Quản lý địa chỉ giao hàng
* Coupon / khuyến mãi
* Dashboard Buyer & Admin
* Quản lý người dùng & phân quyền

### Out-Scope

* Payment gateway (Stripe, PayPal, ...)
* Chat realtime
* Push notification
* Mobile app native

---

## 🛠️ Công Nghệ Sử Dụng

### Frontend

* Next.js 16 (App Router)
* React 19
* Tailwind CSS + shadcn/ui
* SWR (data fetching)
* React Hook Form + Zod

### Backend

* Node.js 18+
* Next.js API Routes
* MongoDB + Prisma ORM
* Authentication dựa trên `x-user-id`
* bcryptjs (hash password)

### DevOps & Tools

* TypeScript 5
* ESLint
* Git
* Vercel (Deploy)

---

## 📁 Kiến Trúc Dự Án

```
app/
├── api/
│   ├── auth/
│   ├── products/
│   ├── cart/
│   ├── orders/
│   ├── recurring-orders/
│   ├── wishlist/
│   ├── coupons/
│   ├── user/
│   ├── buyer/
│   └── admin/
├── auth/
├── products/
├── cart/
├── checkout/
├── profile/
├── dashboard/
│   ├── buyer/
│   └── admin/
└── pages tĩnh (about, faq, policy...)
```

---

## 🧠 Kiến Trúc Hệ Thống

```
UI (Pages)
  ↓
Components
  ↓
Custom Hooks (SWR)
  ↓
API Routes
  ↓
Business Logic (lib)
  ↓
Prisma Client
  ↓
MongoDB
```

---

## 🗄️ Thiết Kế Database (Prisma)

### User

```prisma
id        String   @id @default(auto()) @map("_id") @db.ObjectId
email     String   @unique
password  String
fullName  String
phone     String?
role      UserRole  // ADMIN | BUYER
status    UserStatus
```

### Product

```prisma
id            String   @id @default(auto()) @map("_id") @db.ObjectId
name          String
description   String
price         Float
stock         Int
rating        Float
categoryId    String
status        ProductStatus
variety       String?
season        String?
certification String?
```

### Order

```prisma
id              String   @id @default(auto()) @map("_id") @db.ObjectId
userId          String
shippingAddress String
phone           String
totalAmount     Float
paymentMethod   String
status          OrderStatus
```

### CartItem

```prisma
id        String   @id @default(auto()) @map("_id") @db.ObjectId
userId    String
productId String
quantity  Int
```

### Coupon

```prisma
id    String   @id @default(auto()) @map("_id") @db.ObjectId
code  String   @unique
type  CouponType
value Float
```

### Recurring Order

```prisma
id      String   @id @default(auto()) @map("_id") @db.ObjectId
userId  String
status  RecurringOrderStatus
```

---

## 🔐 Authentication & Authorization

* Lưu `userId` trong localStorage
* Mỗi API gửi header `x-user-id`
* Check role trong admin routes

```ts
if (!userId) return 401
if (user.role !== 'ADMIN') return 403
```

---

## ⚙️ Cấu Hình Môi Trường

```env
DATABASE_URL="mongodb+srv://..."
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

---

## 🚀 Cài Đặt & Chạy Dự Án

```bash
npm install
npx prisma generate
npx prisma db push
npm run db:seed
npm run dev
```

---

## 📊 Dashboard

### Buyer

* Xem đơn hàng
* Quản lý đơn giao định kỳ
* Đánh giá sản phẩm

### Admin

* Quản lý sản phẩm
* Quản lý đơn hàng
* Quản lý user
* Quản lý coupon
* Thống kê & cảnh báo

---

## 🔒 Bảo Mật

* Hash password bằng bcrypt
* Validate input với Zod
* Prisma chống injection

---

## ⚠️ Hạn Chế & Hướng Phát Triển

* Token lưu localStorage → cần nâng cấp httpOnly cookie
* Chưa có testing tự động
* Chưa có realtime & payment gateway

---

## 📄 License

Dự án phục vụ mục đích học tập & nghiên cứu.

---

**Happy Coding! 🚀**
