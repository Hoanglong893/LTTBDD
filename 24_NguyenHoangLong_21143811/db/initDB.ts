import { getDatabase } from './database';

export const initDatabase = async (): Promise<void> => {
  const db = await getDatabase();
  
  // Tạo bảng categories
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE,
      remote_id TEXT,
      updated_at TEXT
    );
  `);
  
  // Tạo bảng products
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      price REAL NOT NULL CHECK(price > 0),
      unit TEXT NOT NULL,
      description TEXT,
      image_uri TEXT,
      category_id INTEGER NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
      remote_id TEXT,
      updated_at TEXT,
      is_deleted INTEGER DEFAULT 0
    );
  `);
  
  // Seed data
  await seedData(db);
};

const seedData = async (db: any): Promise<void> => {
  // Kiểm tra đã có data chưa
  const result = await db.getFirstAsync('SELECT COUNT(*) as count FROM categories');
  if (result.count > 0) return; // Đã có data rồi
  
  const now = new Date().toISOString();
  
  // Thêm 3 danh mục
  const categories = [
    { name: 'Điện thoại', updated_at: now },
    { name: 'Laptop', updated_at: now },
    { name: 'Phụ kiện', updated_at: now }
  ];
  
  for (const cat of categories) {
    await db.runAsync(
      'INSERT INTO categories (name, updated_at) VALUES (?, ?)',
      [cat.name, cat.updated_at]
    );
  }
  
  // Thêm sản phẩm cho mỗi danh mục với HÌNH THẬT
  const products = [
    // Điện thoại (category_id = 1)
    { 
      name: 'iPhone 15 Pro', 
      price: 28990000, 
      unit: 'chiếc', 
      description: 'Điện thoại cao cấp Apple', 
      image_uri: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400', 
      category_id: 1, 
      updated_at: now 
    },
    { 
      name: 'Samsung S24 Ultra', 
      price: 22990000, 
      unit: 'chiếc', 
      description: 'Flagship Samsung 2024', 
      image_uri: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=400', 
      category_id: 1, 
      updated_at: now 
    },
    { 
      name: 'Xiaomi 14 Pro', 
      price: 15990000, 
      unit: 'chiếc', 
      description: 'Xiaomi cao cấp', 
      image_uri: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=400', 
      category_id: 1, 
      updated_at: now 
    },
    
    // Laptop (category_id = 2)
    { 
      name: 'MacBook Pro M3', 
      price: 45990000, 
      unit: 'chiếc', 
      description: 'Laptop Apple chip M3', 
      image_uri: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400', 
      category_id: 2, 
      updated_at: now 
    },
    { 
      name: 'Dell XPS 15', 
      price: 35990000, 
      unit: 'chiếc', 
      description: 'Laptop Dell cao cấp', 
      image_uri: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=400', 
      category_id: 2, 
      updated_at: now 
    },
    { 
      name: 'HP Pavilion 15', 
      price: 18990000, 
      unit: 'chiếc', 
      description: 'Laptop HP phổ thông', 
      image_uri: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400', 
      category_id: 2, 
      updated_at: now 
    },
    
    // Phụ kiện (category_id = 3)
    { 
      name: 'AirPods Pro', 
      price: 4990000, 
      unit: 'chiếc', 
      description: 'Tai nghe không dây Apple', 
      image_uri: 'https://images.unsplash.com/photo-1606841837239-c5a1a4a07af7?w=400', 
      category_id: 3, 
      updated_at: now 
    },
    { 
      name: 'Chuột Logitech MX', 
      price: 1990000, 
      unit: 'chiếc', 
      description: 'Chuột không dây cao cấp', 
      image_uri: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400', 
      category_id: 3, 
      updated_at: now 
    },
    { 
      name: 'Bàn phím cơ Keychron', 
      price: 2490000, 
      unit: 'chiếc', 
      description: 'Bàn phím cơ hot-swap', 
      image_uri: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400', 
      category_id: 3, 
      updated_at: now 
    }
  ];
  
  for (const prod of products) {
    await db.runAsync(
      'INSERT INTO products (name, price, unit, description, image_uri, category_id, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [prod.name, prod.price, prod.unit, prod.description, prod.image_uri, prod.category_id, prod.updated_at]
    );
  }
};