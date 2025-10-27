import * as SQLite from "expo-sqlite";

let db: SQLite.SQLiteDatabase | null = null;

/**
 * Mở database (hoặc tạo mới nếu chưa tồn tại)
 */
export const openDatabase = async (): Promise<SQLite.SQLiteDatabase> => {
    if (db) return db;

    db = await SQLite.openDatabaseAsync("shopping.db");
    return db;
};

/**
 * Khởi tạo các bảng trong database
 */
export const initDatabase = async (): Promise<void> => {
    const database = await openDatabase();

    // Tạo bảng products
    await database.execAsync(`
    CREATE TABLE IF NOT EXISTS products(
        product_id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        price REAL NOT NULL CHECK(price >= 0),
        stock INTEGER NOT NULL CHECK(stock >= 0)
    );
    `);

    // Tạo bảng cart_items
    await database.execAsync(`
    CREATE TABLE IF NOT EXISTS cart_items(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        product_id TEXT NOT NULL,
        qty INTEGER NOT NULL CHECK(qty > 0),
        UNIQUE(product_id),
        FOREIGN KEY(product_id) REFERENCES products(product_id)
    );
    `);

    console.log("✅ Database initialized successfully");
};

/**
 * Seed dữ liệu mẫu cho bảng products
 */
export const seedProducts = async (): Promise<void> => {
    const database = await openDatabase();

    // Kiểm tra xem đã có dữ liệu chưa
    const result = await database.getFirstAsync<{ count: number }>(
        "SELECT COUNT(*) as count FROM products"
    );

    if (result && result.count > 0) {
        console.log("ℹ️ Products already seeded");
        return;
    }

    // Seed dữ liệu mẫu
    const sampleProducts = [
        {
            product_id: "P001",
            name: "iPhone 15 Pro",
            price: 29990000,
            stock: 15,
        },
        {
            product_id: "P002",
            name: "Samsung Galaxy S24",
            price: 22990000,
            stock: 20,
        },
        {
            product_id: "P003",
            name: "MacBook Air M3",
            price: 34990000,
            stock: 10,
        },
        {
            product_id: "P004",
            name: 'iPad Pro 12.9"',
            price: 28990000,
            stock: 12,
        },
        { product_id: "P005", name: "AirPods Pro", price: 6490000, stock: 50 },
        {
            product_id: "P006",
            name: "Apple Watch Series 9",
            price: 11990000,
            stock: 25,
        },
        {
            product_id: "P007",
            name: "Sony WH-1000XM5",
            price: 8990000,
            stock: 18,
        },
        { product_id: "P008", name: "Dell XPS 15", price: 42990000, stock: 8 },
    ];

    for (const product of sampleProducts) {
        await database.runAsync(
            "INSERT INTO products (product_id, name, price, stock) VALUES (?, ?, ?, ?)",
            [product.product_id, product.name, product.price, product.stock]
        );
    }

    console.log("✅ Sample products seeded successfully");
};

/**
 * Reset toàn bộ database (dùng cho testing)
 */
export const resetDatabase = async (): Promise<void> => {
    try {
        // Close database connection trước khi xóa
        if (db) {
            await db.closeAsync();
            db = null;
        }

        // Xóa database file
        await SQLite.deleteDatabaseAsync("shopping.db");
        console.log("🗑️ Database deleted");

        // Tạo lại database mới
        await initDatabase();
        await seedProducts();

        console.log("✅ Database reset successfully");
    } catch (error) {
        console.error("❌ Error resetting database:", error);
        throw error;
    }
};
