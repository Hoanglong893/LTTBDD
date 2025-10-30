import { getDatabase } from './database';
import { Category, Product } from '../types';

// Lấy tất cả danh mục
export const getAllCategories = async (): Promise<Category[]> => {
  const db = await getDatabase();
  return await db.getAllAsync<Category>('SELECT * FROM categories ORDER BY name');
};

// Lấy sản phẩm theo danh mục
export const getProductsByCategory = async (categoryId: number): Promise<Product[]> => {
  const db = await getDatabase();
  return await db.getAllAsync<Product>(
    'SELECT * FROM products WHERE category_id = ? AND is_deleted = 0 ORDER BY name',
    [categoryId]
  );
};

// Tìm kiếm sản phẩm theo tên
export const searchProducts = async (categoryId: number, searchText: string): Promise<Product[]> => {
  const db = await getDatabase();
  return await db.getAllAsync<Product>(
    'SELECT * FROM products WHERE category_id = ? AND is_deleted = 0 AND name LIKE ? ORDER BY name',
    [categoryId, `%${searchText}%`]
  );
};

// Lấy chi tiết sản phẩm
export const getProductById = async (id: number): Promise<Product | null> => {
  const db = await getDatabase();
  return await db.getFirstAsync<Product>('SELECT * FROM products WHERE id = ?', [id]);
};

// Thêm sản phẩm
export const addProduct = async (product: Omit<Product, 'id' | 'remote_id' | 'updated_at' | 'is_deleted'>): Promise<any> => {
  const db = await getDatabase();
  const now = new Date().toISOString();
  return await db.runAsync(
    'INSERT INTO products (name, price, unit, description, image_uri, category_id, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [product.name ?? '', product.price ?? 0, product.unit ?? '', product.description ?? '', product.image_uri ?? '', product.category_id ?? 0, now]
  );
};

// Cập nhật sản phẩm
export const updateProduct = async (id: number, product: Partial<Product>): Promise<any> => {
  const db = await getDatabase();
  const now = new Date().toISOString();
  return await db.runAsync(
    'UPDATE products SET name = ?, price = ?, unit = ?, description = ?, image_uri = ?, updated_at = ? WHERE id = ?',
    [product.name ?? '', product.price ?? 0, product.unit ?? '', product.description ?? '', product.image_uri ?? '', now, id]
  );
};

// Xóa mềm sản phẩm
export const deleteProduct = async (id: number): Promise<any> => {
  const db = await getDatabase();
  const now = new Date().toISOString();
  return await db.runAsync(
    'UPDATE products SET is_deleted = 1, updated_at = ? WHERE id = ?',
    [now, id]
  );
};

// ======== SYNC QUERIES ========

// Lấy tất cả categories để sync
export const getAllCategoriesForSync = async (): Promise<Category[]> => {
  const db = await getDatabase();
  return await db.getAllAsync<Category>('SELECT * FROM categories');
};

// Lấy tất cả products để sync
export const getAllProductsForSync = async (): Promise<Product[]> => {
  const db = await getDatabase();
  return await db.getAllAsync<Product>('SELECT * FROM products WHERE is_deleted = 0');
};

// Lấy products đã xóa
export const getDeletedProducts = async (): Promise<Product[]> => {
  const db = await getDatabase();
  return await db.getAllAsync<Product>('SELECT * FROM products WHERE is_deleted = 1 AND remote_id IS NOT NULL');
};

// Cập nhật remote_id cho category
export const updateCategoryRemoteId = async (localId: number, remoteId: string, updatedAt: string): Promise<any> => {
  const db = await getDatabase();
  return await db.runAsync(
    'UPDATE categories SET remote_id = ?, updated_at = ? WHERE id = ?',
    [remoteId, updatedAt, localId]
  );
};

// Cập nhật remote_id cho product
export const updateProductRemoteId = async (localId: number, remoteId: string, updatedAt: string): Promise<any> => {
  const db = await getDatabase();
  return await db.runAsync(
    'UPDATE products SET remote_id = ?, updated_at = ? WHERE id = ?',
    [remoteId, updatedAt, localId]
  );
};

// Insert category từ remote
export const insertCategoryFromRemote = async (category: { name: string; id: string; updatedAt: string }): Promise<any> => {
  const db = await getDatabase();
  return await db.runAsync(
    'INSERT INTO categories (name, remote_id, updated_at) VALUES (?, ?, ?)',
    [category.name, category.id, category.updatedAt]
  );
};

// Update category từ remote
export const updateCategoryFromRemote = async (localId: number, category: { name: string; updatedAt: string }): Promise<any> => {
  const db = await getDatabase();
  return await db.runAsync(
    'UPDATE categories SET name = ?, updated_at = ? WHERE id = ?',
    [category.name, category.updatedAt, localId]
  );
};

// Insert product từ remote
export const insertProductFromRemote = async (product: any, localCategoryId: number): Promise<any> => {
  const db = await getDatabase();
  return await db.runAsync(
    'INSERT INTO products (name, price, unit, description, image_uri, category_id, remote_id, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
    [product.name, product.price, product.unit, product.description || '', product.image_uri || '', localCategoryId, product.id, product.updatedAt]
  );
};

// Update product từ remote
export const updateProductFromRemote = async (localId: number, product: any): Promise<any> => {
  const db = await getDatabase();
  return await db.runAsync(
    'UPDATE products SET name = ?, price = ?, unit = ?, description = ?, image_uri = ?, updated_at = ? WHERE id = ?',
    [product.name, product.price, product.unit, product.description || '', product.image_uri || '', product.updatedAt, localId]
  );
};

// Xóa thật product đã sync
export const hardDeleteProduct = async (id: number): Promise<any> => {
  const db = await getDatabase();
  return await db.runAsync('DELETE FROM products WHERE id = ?', [id]);
};

// Tìm category theo remote_id
export const getCategoryByRemoteId = async (remoteId: string): Promise<Category | null> => {
  const db = await getDatabase();
  return await db.getFirstAsync<Category>('SELECT * FROM categories WHERE remote_id = ?', [remoteId]);
};

// Tìm product theo remote_id
export const getProductByRemoteId = async (remoteId: string): Promise<Product | null> => {
  const db = await getDatabase();
  return await db.getFirstAsync<Product>('SELECT * FROM products WHERE remote_id = ?', [remoteId]);
};