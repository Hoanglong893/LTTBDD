# 🛍️ ỨNG DỤNG MUA SẮM ONLINE

Ứng dụng mua sắm đơn giản được xây dựng bằng React Native (Expo), sử dụng SQLite để lưu trữ dữ liệu.

## 📱 Tính Năng

- ✅ Xem danh sách sản phẩm
- ✅ Thêm sản phẩm vào giỏ hàng
- ✅ Quản lý giỏ hàng (tăng/giảm số lượng, xóa)
- ✅ Xem hóa đơn với tính toán VAT
- ✅ Thanh toán và cập nhật tồn kho
- ✅ Dữ liệu lưu bền (không mất khi tắt app)

## 🚀 Cài Đặt

### 1. Yêu cầu

- Node.js (phiên bản 18 trở lên)
- npm hoặc yarn
- Expo CLI
- Điện thoại có cài Expo Go hoặc Android Emulator/iOS Simulator

### 2. Tạo project mới

```bash
# Tạo project với TypeScript
npx create-expo-app shopping-sqlite --template blank-typescript

# Di chuyển vào thư mục
cd shopping-sqlite
```

### 3. Cài đặt thư viện cần thiết

```bash
npx expo install expo-router react-native-safe-area-context react-native-screens expo-sqlite
```

### 4. Copy code

Copy tất cả các file từ source code vào đúng vị trí:

```
shopping-sqlite/
├── app/
│   ├── _layout.tsx
│   ├── index.tsx
│   ├── cart.tsx
│   └── invoice.tsx
├── src/
│   ├── db/
│   │   ├── db.ts
│   │   ├── product.repo.ts
│   │   └── cart.repo.ts
│   └── models/
│       └── types.ts
├── package.json
├── tsconfig.json
├── app.json
├── babel.config.js
└── .gitignore
```

### 5. Chạy ứng dụng

```bash
# Khởi động Expo
npx expo start

# Sau đó chọn:
# - Nhấn 'a' để mở trên Android
# - Nhấn 'i' để mở trên iOS (chỉ trên Mac)
# - Quét mã QR bằng Expo Go trên điện thoại
```

## 📖 Hướng Dẫn Sử Dụng

### Trang Sản Phẩm

1. Mở app → Hiển thị danh sách 8 sản phẩm mẫu
2. Mỗi sản phẩm có: tên, giá, số lượng tồn kho
3. Nhấn nút **"+ Thêm"** để thêm vào giỏ hàng
4. Badge giỏ hàng sẽ hiển thị số lượng sản phẩm

### Trang Giỏ Hàng

1. Nhấn nút **"🛒 Xem Giỏ Hàng"** ở cuối màn hình
2. Xem danh sách sản phẩm đã chọn
3. Dùng nút **+/-** để tăng/giảm số lượng
4. Nhấn **🗑️** để xóa sản phẩm
5. Nhấn **"Xóa tất cả"** để làm trống giỏ hàng
6. Nhấn **"Xem Hóa Đơn"** để tiếp tục

### Trang Hóa Đơn

1. Xem chi tiết các sản phẩm
2. Kiểm tra tổng tiền (đã bao gồm VAT 10%)
3. Nhấn **"Thanh toán"** để hoàn tất
4. Hệ thống sẽ:
   - Trừ số lượng tồn kho
   - Xóa giỏ hàng
   - Quay về trang chủ

## 🗄️ Cơ Sở Dữ Liệu

App sử dụng SQLite với 2 bảng:

### Bảng `products` (Sản phẩm)

| Cột       | Kiểu   | Mô tả                       |
| ---------- | ------- | ----------------------------- |
| product_id | TEXT    | Mã sản phẩm (khóa chính) |
| name       | TEXT    | Tên sản phẩm               |
| price      | REAL    | Giá (VNĐ)                   |
| stock      | INTEGER | Số lượng tồn kho          |

### Bảng `cart_items` (Giỏ hàng)

| Cột       | Kiểu   | Mô tả                       |
| ---------- | ------- | ----------------------------- |
| id         | INTEGER | ID tự động tăng           |
| product_id | TEXT    | Mã sản phẩm (khóa ngoại) |
| qty        | INTEGER | Số lượng                   |

## 🔧 Xử Lý Lỗi

### Lỗi: "Cannot find module 'expo-router/entry'"

**Giải pháp:**

1. Kiểm tra file `package.json` có dòng:
   ```json
   "main": "expo-router/entry"
   ```
2. Xóa node_modules và cài lại:
   ```bash
   rm -rf node_modules
   npm install
   npx expo start -c
   ```

### Lỗi: SQLite không hoạt động

**Giải pháp:**

```bash
npx expo install expo-sqlite
npx expo start -c
```

### Lỗi: App bị crash khi chạy

**Giải pháp:**

1. Xem console log để biết lỗi cụ thể
2. Clear cache:
   ```bash
   npx expo start -c
   ```
3. Reset database (nếu cần):
   - Xóa file `shopping.db` trong app
   - Hoặc gọi hàm `resetDatabase()` trong code

## 📁 Cấu Trúc Thư Mục

```
shopping-sqlite/
├── app/                      # Các màn hình
│   ├── _layout.tsx          # Layout chính (khởi tạo DB)
│   ├── index.tsx            # Màn hình danh sách sản phẩm
│   ├── cart.tsx             # Màn hình giỏ hàng
│   └── invoice.tsx          # Màn hình hóa đơn
│
├── src/
│   ├── db/                  # Layer database
│   │   ├── db.ts            # Khởi tạo & quản lý DB
│   │   ├── product.repo.ts  # Thao tác với bảng products
│   │   └── cart.repo.ts     # Thao tác với bảng cart_items
│   │
│   └── models/
│       └── types.ts         # Định nghĩa TypeScript types
│
├── assets/                   # Hình ảnh, icon
├── package.json             # Dependencies
├── tsconfig.json            # Cấu hình TypeScript
├── app.json                 # Cấu hình Expo
└── babel.config.js          # Cấu hình Babel
```

## 💻 Công Nghệ Sử Dụng

- **React Native** - Framework mobile
- **Expo** - Công cụ phát triển
- **expo-router** - Điều hướng (navigation)
- **expo-sqlite** - Database SQLite
- **TypeScript** - Ngôn ngữ lập trình

## 📝 Ghi Chú

### Dữ liệu mẫu

App tự động tạo 8 sản phẩm mẫu khi chạy lần đầu:

- iPhone 15 Pro - 29,990,000₫
- Samsung Galaxy S24 - 22,990,000₫
- MacBook Air M3 - 34,990,000₫
- iPad Pro 12.9" - 28,990,000₫
- AirPods Pro - 6,490,000₫
- Apple Watch Series 9 - 11,990,000₫
- Sony WH-1000XM5 - 8,990,000₫
- Dell XPS 15 - 42,990,000₫

### Quy tắc nghiệp vụ

- ✅ Không thể thêm sản phẩm hết hàng vào giỏ
- ✅ Số lượng trong giỏ không được vượt quá tồn kho
- ✅ Số lượng phải lớn hơn 0
- ✅ VAT được tính 10% trên tổng tiền
- ✅ Thanh toán sẽ trừ tồn kho và xóa giỏ hàng

## 🎯 Mở Rộng

Bạn có thể thêm các tính năng:

1. **Tìm kiếm sản phẩm** - Thêm ô tìm kiếm theo tên
2. **Lọc theo giá** - Filter sản phẩm theo khoảng giá
3. **Lịch sử đơn hàng** - Lưu các đơn hàng đã thanh toán
4. **Hình ảnh sản phẩm** - Thêm ảnh cho mỗi sản phẩm
5. **Phân loại** - Chia sản phẩm theo danh mục
6. **Đánh giá** - Cho phép người dùng đánh giá sản phẩm

## 🐛 Báo Lỗi

Nếu gặp lỗi, hãy:

1. Kiểm tra console log
2. Đọc phần "Xử Lý Lỗi" ở trên
3. Google error message
4. Liên hệ giảng viên nếu cần hỗ trợ

## 📚 Tài Liệu Tham Khảo

- [Expo Documentation](https://docs.expo.dev/)
- [React Native Docs](https://reactnative.dev/)
- [expo-router Guide](https://docs.expo.dev/router/introduction/)
- [expo-sqlite API](https://docs.expo.dev/versions/latest/sdk/sqlite/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
