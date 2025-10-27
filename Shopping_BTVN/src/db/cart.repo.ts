import { openDatabase } from './db';
import { CartItem, CartItemWithProduct } from '../models/types';
import { getProductById } from './product.repo';

/**
 * Lấy tất cả items trong giỏ hàng (JOIN với products)
 */
export const getCartItems = async (): Promise<CartItemWithProduct[]> => {
    const db = await openDatabase();
    const items = await db.getAllAsync<CartItemWithProduct>(`
        SELECT 
        c.id,
        c.product_id,
        c.qty,
        p.name,
        p.price,
        p.stock,
        (c.qty * p.price) as subtotal
        FROM cart_items c
        INNER JOIN products p ON c.product_id = p.product_id
        ORDER BY c.id ASC
    `);
    return items;
};

/**
 * Lấy cart item theo product_id
 */
export const getCartItemByProductId = async (productId: string): Promise<CartItem | null> => {
    const db = await openDatabase();
    const item = await db.getFirstAsync<CartItem>(
        'SELECT * FROM cart_items WHERE product_id = ?',
        [productId]
    );
    return item || null;
};

/**
 * Thêm sản phẩm vào giỏ hàng
 * Nếu sản phẩm đã có trong giỏ, tăng số lượng lên 1
 */
export const addToCart = async (productId: string): Promise<{ success: boolean; message: string }> => {
    const db = await openDatabase();
    
    // Kiểm tra sản phẩm có tồn tại không
    const product = await getProductById(productId);
    if (!product) {
        return { success: false, message: 'Sản phẩm không tồn tại' };
    }
    
    // Kiểm tra tồn kho
    if (product.stock <= 0) {
        return { success: false, message: 'Sản phẩm hết hàng' };
    }
    
    // Kiểm tra xem sản phẩm đã có trong giỏ chưa
    const existingItem = await getCartItemByProductId(productId);
    
    if (existingItem) {
        // Nếu đã có, kiểm tra xem có thể tăng số lượng không
        if (existingItem.qty >= product.stock) {
        return { success: false, message: 'Không đủ hàng trong kho' };
        }
        
        // Tăng số lượng lên 1
        await db.runAsync(
        'UPDATE cart_items SET qty = qty + 1 WHERE product_id = ?',
        [productId]
        );
        return { success: true, message: 'Đã tăng số lượng trong giỏ hàng' };
    } else {
        // Thêm mới vào giỏ với qty = 1
        await db.runAsync(
        'INSERT INTO cart_items (product_id, qty) VALUES (?, 1)',
        [productId]
        );
        return { success: true, message: 'Đã thêm vào giỏ hàng' };
    }
};

/**
 * Cập nhật số lượng sản phẩm trong giỏ
 */
export const updateCartItemQty = async (
    productId: string, 
    newQty: number
    ): Promise<{ success: boolean; message: string }> => {
    const db = await openDatabase();
    
    // Validate qty
    if (newQty <= 0) {
        return { success: false, message: 'Số lượng phải lớn hơn 0' };
    }
    
    // Kiểm tra tồn kho
    const product = await getProductById(productId);
    if (!product) {
        return { success: false, message: 'Sản phẩm không tồn tại' };
    }
    
    if (newQty > product.stock) {
        return { success: false, message: `Chỉ còn ${product.stock} sản phẩm trong kho` };
    }
    
    await db.runAsync(
        'UPDATE cart_items SET qty = ? WHERE product_id = ?',
        [newQty, productId]
    );
    
    return { success: true, message: 'Đã cập nhật số lượng' };
};

/**
 * Xóa sản phẩm khỏi giỏ hàng
 */
export const removeFromCart = async (productId: string): Promise<void> => {
    const db = await openDatabase();
    await db.runAsync(
        'DELETE FROM cart_items WHERE product_id = ?',
        [productId]
    );
};

/**
 * Xóa toàn bộ giỏ hàng
 */
export const clearCart = async (): Promise<void> => {
    const db = await openDatabase();
    await db.runAsync('DELETE FROM cart_items');
};

/**
 * Đếm số lượng items trong giỏ
 */
export const getCartCount = async (): Promise<number> => {
    const db = await openDatabase();
    const result = await db.getFirstAsync<{ count: number }>(
        'SELECT COUNT(*) as count FROM cart_items'
    );
    return result?.count || 0;
};

/**
 * Tính tổng tiền trong giỏ hàng
 */
export const getCartTotal = async (): Promise<number> => {
    const db = await openDatabase();
    const result = await db.getFirstAsync<{ total: number | null }>(`
        SELECT SUM(c.qty * p.price) as total
        FROM cart_items c
        INNER JOIN products p ON c.product_id = p.product_id
    `);
    return result?.total || 0;
};