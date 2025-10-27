import { useState, useEffect } from "react";
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    TouchableOpacity,
    Alert,
    ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { CartItemWithProduct } from "../src/models/types";
import {
    getCartItems,
    updateCartItemQty,
    removeFromCart,
    clearCart,
    getCartTotal,
} from "../src/db/cart.repo";

export default function CartScreen() {
    const router = useRouter();
    const [cartItems, setCartItems] = useState<CartItemWithProduct[]>([]);
    const [loading, setLoading] = useState(true);
    const [total, setTotal] = useState(0);

    const loadCart = async () => {
        try {
            const items = await getCartItems();
            setCartItems(items);
            const totalAmount = await getCartTotal();
            setTotal(totalAmount);
        } catch (error) {
            console.error("Error loading cart:", error);
            Alert.alert("Lỗi", "Không thể tải giỏ hàng");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadCart();
    }, []);

    const handleIncreaseQty = async (
        productId: string,
        currentQty: number,
        stock: number
    ) => {
        if (currentQty >= stock) {
            Alert.alert("Thông báo", "Không đủ hàng trong kho");
            return;
        }
        try {
            const result = await updateCartItemQty(productId, currentQty + 1);
            if (result.success) {
                loadCart();
            } else {
                Alert.alert("Thông báo", result.message);
            }
        } catch (error) {
            Alert.alert("Lỗi", "Không thể cập nhật số lượng");
        }
    };

    const handleDecreaseQty = async (productId: string, currentQty: number) => {
        if (currentQty <= 1) {
            Alert.alert(
                "Xác nhận",
                "Bạn có muốn xóa sản phẩm này khỏi giỏ hàng?",
                [
                    { text: "Hủy", style: "cancel" },
                    {
                        text: "Xóa",
                        style: "destructive",
                        onPress: () => handleRemoveItem(productId),
                    },
                ]
            );
            return;
        }
        try {
            const result = await updateCartItemQty(productId, currentQty - 1);
            if (result.success) {
                loadCart();
            } else {
                Alert.alert("Thông báo", result.message);
            }
        } catch (error) {
            Alert.alert("Lỗi", "Không thể cập nhật số lượng");
        }
    };

    const handleRemoveItem = async (productId: string) => {
        try {
            await removeFromCart(productId);
            loadCart();
            Alert.alert("Thành công", "Đã xóa sản phẩm khỏi giỏ hàng");
        } catch (error) {
            Alert.alert("Lỗi", "Không thể xóa sản phẩm");
        }
    };

    const handleClearCart = () => {
        Alert.alert("Xác nhận", "Bạn có chắc muốn xóa toàn bộ giỏ hàng?", [
            { text: "Hủy", style: "cancel" },
            {
                text: "Xóa tất cả",
                style: "destructive",
                onPress: async () => {
                    try {
                        await clearCart();
                        loadCart();
                        Alert.alert("Thành công", "Đã xóa toàn bộ giỏ hàng");
                    } catch (error) {
                        Alert.alert("Lỗi", "Không thể xóa giỏ hàng");
                    }
                },
            },
        ]);
    };

    const handleViewInvoice = () => {
        if (cartItems.length === 0) {
            Alert.alert("Thông báo", "Giỏ hàng trống");
            return;
        }
        router.push("/invoice");
    };

    const formatCurrency = (amount: number): string => {
        return amount.toLocaleString("vi-VN") + " ₫";
    };

    const renderCartItem = ({ item }: { item: CartItemWithProduct }) => (
        <View style={styles.cartItemCard}>
            <View style={styles.itemInfo}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemPrice}>
                    {formatCurrency(item.price)}
                </Text>
                <Text style={styles.itemSubtotal}>
                    Tạm tính: {formatCurrency(item.subtotal)}
                </Text>
            </View>

            <View style={styles.qtyControls}>
                <TouchableOpacity
                    style={styles.qtyButton}
                    onPress={() => handleDecreaseQty(item.product_id, item.qty)}
                >
                    <Text style={styles.qtyButtonText}>−</Text>
                </TouchableOpacity>

                <Text style={styles.qtyText}>{item.qty}</Text>

                <TouchableOpacity
                    style={styles.qtyButton}
                    onPress={() =>
                        handleIncreaseQty(item.product_id, item.qty, item.stock)
                    }
                >
                    <Text style={styles.qtyButtonText}>+</Text>
                </TouchableOpacity>
            </View>

            <TouchableOpacity
                style={styles.removeButton}
                onPress={() => {
                    Alert.alert("Xác nhận", "Xóa sản phẩm này khỏi giỏ hàng?", [
                        { text: "Hủy", style: "cancel" },
                        {
                            text: "Xóa",
                            style: "destructive",
                            onPress: () => handleRemoveItem(item.product_id),
                        },
                    ]);
                }}
            >
                <Text style={styles.removeButtonText}>🗑️</Text>
            </TouchableOpacity>
        </View>
    );

    if (loading) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" color="#007AFF" />
                <Text style={styles.loadingText}>Đang tải giỏ hàng...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {cartItems.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>🛒</Text>
                    <Text style={styles.emptyMessage}>Giỏ hàng trống</Text>
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => router.back()}
                    >
                        <Text style={styles.backButtonText}>
                            ← Quay lại mua sắm
                        </Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <>
                    <FlatList
                        data={cartItems}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={renderCartItem}
                        contentContainerStyle={styles.listContainer}
                    />

                    <View style={styles.summarySection}>
                        <View style={styles.totalRow}>
                            <Text style={styles.totalLabel}>Tổng cộng:</Text>
                            <Text style={styles.totalAmount}>
                                {formatCurrency(total)}
                            </Text>
                        </View>

                        <View style={styles.actionButtons}>
                            <TouchableOpacity
                                style={styles.clearButton}
                                onPress={handleClearCart}
                            >
                                <Text style={styles.clearButtonText}>
                                    Xóa tất cả
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.invoiceButton}
                                onPress={handleViewInvoice}
                            >
                                <Text style={styles.invoiceButtonText}>
                                    Xem Hóa Đơn →
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </>
            )}
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
    listContainer: { padding: 16, paddingBottom: 20 },
    cartItemCard: {
        backgroundColor: "#fff",
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    itemInfo: { marginBottom: 12 },
    itemName: {
        fontSize: 16,
        fontWeight: "600",
        color: "#333",
        marginBottom: 4,
    },
    itemPrice: { fontSize: 14, color: "#666", marginBottom: 4 },
    itemSubtotal: { fontSize: 16, fontWeight: "bold", color: "#007AFF" },
    qtyControls: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 8,
    },
    qtyButton: {
        backgroundColor: "#007AFF",
        width: 36,
        height: 36,
        borderRadius: 18,
        justifyContent: "center",
        alignItems: "center",
    },
    qtyButtonText: { color: "#fff", fontSize: 20, fontWeight: "bold" },
    qtyText: {
        fontSize: 18,
        fontWeight: "600",
        marginHorizontal: 20,
        minWidth: 30,
        textAlign: "center",
    },
    removeButton: { alignSelf: "center", padding: 8 },
    removeButtonText: { fontSize: 24 },
    emptyContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 40,
    },
    emptyText: { fontSize: 80, marginBottom: 16 },
    emptyMessage: { fontSize: 18, color: "#666", marginBottom: 24 },
    backButton: {
        backgroundColor: "#007AFF",
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 8,
    },
    backButtonText: { color: "#fff", fontSize: 16, fontWeight: "600" },
    summarySection: {
        backgroundColor: "#fff",
        padding: 16,
        borderTopWidth: 1,
        borderTopColor: "#e0e0e0",
    },
    totalRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 16,
    },
    totalLabel: { fontSize: 18, fontWeight: "600", color: "#333" },
    totalAmount: { fontSize: 24, fontWeight: "bold", color: "#007AFF" },
    actionButtons: { flexDirection: "row", gap: 12 },
    clearButton: {
        flex: 1,
        backgroundColor: "#FF3B30",
        padding: 14,
        borderRadius: 8,
        alignItems: "center",
    },
    clearButtonText: { color: "#fff", fontSize: 16, fontWeight: "600" },
    invoiceButton: {
        flex: 2,
        backgroundColor: "#34C759",
        padding: 14,
        borderRadius: 8,
        alignItems: "center",
    },
    invoiceButtonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
});
