import { openDatabase } from './db';
import { Product } from '../models/types';

/**
 * Lấy tất cả sản phẩm
 */
export const getAllProducts = async (): Promise<Product[]> => {
    const db = await openDatabase();
    const products = await db.getAllAsync<Product>(
        'SELECT * FROM products ORDER BY name ASC'
    );
    return products;
};

/**
 * Lấy sản phẩm theo ID
 */
export const getProductById = async (productId: string): Promise<Product | null> => {
    const db = await openDatabase();
    const product = await db.getFirstAsync<Product>(
        'SELECT * FROM products WHERE product_id = ?',
        [productId]
    );
    return product || null;
};

/**
 * Thêm sản phẩm mới
 */
export const addProduct = async (product: Omit<Product, 'product_id'> & { product_id: string }): Promise<void> => {
    const db = await openDatabase();
    await db.runAsync(
        'INSERT INTO products (product_id, name, price, stock) VALUES (?, ?, ?, ?)',
        [product.product_id, product.name, product.price, product.stock]
    );
};

/**
 * Cập nhật tồn kho sản phẩm
 */
export const updateProductStock = async (productId: string, newStock: number): Promise<void> => {
    const db = await openDatabase();
    await db.runAsync(
        'UPDATE products SET stock = ? WHERE product_id = ?',
        [newStock, productId]
    );
};

/**
 * Tìm kiếm sản phẩm theo tên
 */
export const searchProducts = async (keyword: string): Promise<Product[]> => {
    const db = await openDatabase();
    const products = await db.getAllAsync<Product>(
        'SELECT * FROM products WHERE name LIKE ? ORDER BY name ASC',
        [`%${keyword}%`]
    );
    return products;
};

/**
 * Lọc sản phẩm theo khoảng giá
 */
export const filterProductsByPrice = async (minPrice: number, maxPrice: number): Promise<Product[]> => {
    const db = await openDatabase();
    const products = await db.getAllAsync<Product>(
        'SELECT * FROM products WHERE price BETWEEN ? AND ? ORDER BY price ASC',
        [minPrice, maxPrice]
    );
    return products;
};