import { useState, useEffect, useCallback } from 'react';
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    TouchableOpacity,
    Alert,
    ActivityIndicator,
    RefreshControl,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Product } from '../src/models/types';
import { getAllProducts } from '../src/db/product.repo';
import { addToCart, getCartCount } from '../src/db/cart.repo';

export default function ProductsScreen() {
    const router = useRouter();
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [cartCount, setCartCount] = useState(0);

    const loadProducts = async () => {
        try {
        const data = await getAllProducts();
        setProducts(data);
        const count = await getCartCount();
        setCartCount(count);
        } catch (error) {
        console.error('Error loading products:', error);
        Alert.alert('Lỗi', 'Không thể tải danh sách sản phẩm');
        } finally {
        setLoading(false);
        setRefreshing(false);
        }
    };

    useEffect(() => {
        loadProducts();
    }, []);

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        loadProducts();
    }, []);

    const handleAddToCart = async (productId: string) => {
        try {
        const result = await addToCart(productId);
        if (result.success) {
            Alert.alert('Thành công', result.message);
            const count = await getCartCount();
            setCartCount(count);
            loadProducts();
        } else {
            Alert.alert('Thông báo', result.message);
        }
        } catch (error) {
        console.error('Error adding to cart:', error);
        Alert.alert('Lỗi', 'Không thể thêm sản phẩm vào giỏ hàng');
        }
    };

    const formatCurrency = (amount: number): string => {
        return amount.toLocaleString('vi-VN') + ' ₫';
    };

    const renderProduct = ({ item }: { item: Product }) => (
        <View style={styles.productCard}>
        <View style={styles.productInfo}>
            <Text style={styles.productName}>{item.name}</Text>
            <Text style={styles.productPrice}>{formatCurrency(item.price)}</Text>
            <Text style={[styles.productStock, item.stock === 0 && styles.outOfStock]}>
            {item.stock > 0 ? `Còn ${item.stock} sản phẩm` : 'Hết hàng'}
            </Text>
        </View>
        <TouchableOpacity
            style={[styles.addButton, item.stock === 0 && styles.disabledButton]}
            onPress={() => handleAddToCart(item.product_id)}
            disabled={item.stock === 0}
        >
            <Text style={styles.addButtonText}>
            {item.stock > 0 ? '+ Thêm' : 'Hết'}
            </Text>
        </TouchableOpacity>
        </View>
    );

    if (loading) {
        return (
        <View style={styles.centered}>
            <ActivityIndicator size="large" color="#007AFF" />
            <Text style={styles.loadingText}>Đang tải sản phẩm...</Text>
        </View>
        );
    }

    return (
        <View style={styles.container}>
        <FlatList
            data={products}
            keyExtractor={(item) => item.product_id}
            renderItem={renderProduct}
            contentContainerStyle={styles.listContainer}
            refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            ListEmptyComponent={
            <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>Không có sản phẩm nào</Text>
            </View>
            }
        />
        <View style={styles.bottomBar}>
            <TouchableOpacity
            style={styles.cartButton}
            onPress={() => router.push('/cart')}
            >
            <Text style={styles.cartButtonText}>
                🛒 Xem Giỏ Hàng ({cartCount})
            </Text>
            </TouchableOpacity>
        </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#f5f5f5" },
    centered: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f5f5f5",
    },
    loadingText: { marginTop: 10, fontSize: 16, color: "#666" },
    listContainer: { padding: 16, paddingBottom: 80 },
    productCard: {
        backgroundColor: "#fff",
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    productInfo: { flex: 1, marginRight: 12 },
    productName: {
        fontSize: 16,
        fontWeight: "600",
        color: "#333",
        marginBottom: 6,
    },
    productPrice: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#007AFF",
        marginBottom: 4,
    },
    productStock: { fontSize: 14, color: "#666" },
    outOfStock: { color: "#FF3B30", fontWeight: "600" },
    addButton: {
        backgroundColor: "#007AFF",
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 8,
        minWidth: 80,
        alignItems: "center",
    },
    disabledButton: { backgroundColor: "#ccc" },
    addButtonText: { color: "#fff", fontSize: 16, fontWeight: "600" },
    emptyContainer: { padding: 40, alignItems: "center" },
    emptyText: { fontSize: 16, color: "#999" },
    bottomBar: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: "#fff",
        padding: 16,
        borderTopWidth: 1,
        borderTopColor: "#e0e0e0",
    },
    cartButton: {
        backgroundColor: "#34C759",
        padding: 16,
        borderRadius: 12,
        alignItems: "center",
    },
    cartButtonText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
});