import { useState, useEffect } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Alert,
    ActivityIndicator,
    ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import { CartItemWithProduct } from "../src/models/types";
import { getCartItems, clearCart } from "../src/db/cart.repo";
import { updateProductStock, getProductById } from "../src/db/product.repo";

export default function InvoiceScreen() {
    const router = useRouter();
    const [items, setItems] = useState<CartItemWithProduct[]>([]);
    const [loading, setLoading] = useState(true);
    const [subtotal, setSubtotal] = useState(0);
    const [vat, setVat] = useState(0);
    const [total, setTotal] = useState(0);
    const [invoiceDate, setInvoiceDate] = useState("");

    const VAT_RATE = 0.1;

    const loadInvoice = async () => {
        try {
            const cartItems = await getCartItems();

            if (cartItems.length === 0) {
                Alert.alert("Thông báo", "Giỏ hàng trống", [
                    { text: "OK", onPress: () => router.back() },
                ]);
                return;
            }

            setItems(cartItems);

            const subtotalAmount = cartItems.reduce(
                (sum, item) => sum + item.subtotal,
                0
            );
            const vatAmount = subtotalAmount * VAT_RATE;
            const totalAmount = subtotalAmount + vatAmount;

            setSubtotal(subtotalAmount);
            setVat(vatAmount);
            setTotal(totalAmount);

            const now = new Date();
            const dateString = now.toLocaleDateString("vi-VN", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
            });
            setInvoiceDate(dateString);
        } catch (error) {
            console.error("Error loading invoice:", error);
            Alert.alert("Lỗi", "Không thể tải hóa đơn");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadInvoice();
    }, []);

    const handleCheckout = () => {
        Alert.alert(
            "Xác nhận thanh toán",
            `Tổng tiền: ${formatCurrency(
                total
            )}\n\nXác nhận thanh toán và hoàn tất đơn hàng?`,
            [
                { text: "Hủy", style: "cancel" },
                {
                    text: "Thanh toán",
                    onPress: async () => {
                        try {
                            for (const item of items) {
                                const product = await getProductById(
                                    item.product_id
                                );
                                if (product) {
                                    const newStock = product.stock - item.qty;
                                    await updateProductStock(
                                        item.product_id,
                                        newStock
                                    );
                                }
                            }

                            await clearCart();

                            Alert.alert(
                                "Thanh toán thành công",
                                "Cảm ơn bạn đã mua hàng!",
                                [
                                    {
                                        text: "OK",
                                        onPress: () => router.replace("/"),
                                    },
                                ]
                            );
                        } catch (error) {
                            console.error("Error processing checkout:", error);
                            Alert.alert("Lỗi", "Không thể xử lý thanh toán");
                        }
                    },
                },
            ]
        );
    };

    const formatCurrency = (amount: number): string => {
        return amount.toLocaleString("vi-VN") + " ₫";
    };

    if (loading) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" color="#007AFF" />
                <Text style={styles.loadingText}>Đang tạo hóa đơn...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <ScrollView style={styles.scrollView}>
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>HÓA ĐƠN BÁN HÀNG</Text>
                    <Text style={styles.invoiceDate}>Ngày: {invoiceDate}</Text>
                    <View style={styles.divider} />
                </View>

                <View style={styles.itemsSection}>
                    <View style={styles.tableHeader}>
                        <Text style={styles.thIndex}>#</Text>
                        <Text style={styles.thName}>Sản phẩm</Text>
                        <Text style={styles.thAmount}>Thành tiền</Text>
                    </View>

                    {items.map((item, index) => (
                        <View key={item.id} style={styles.invoiceItem}>
                            <Text style={styles.itemIndex}>{index + 1}</Text>
                            <View style={styles.itemDetails}>
                                <Text style={styles.itemName}>{item.name}</Text>
                                <Text style={styles.itemQtyPrice}>
                                    SL: {item.qty} ×{" "}
                                    {formatCurrency(item.price)}
                                </Text>
                            </View>
                            <Text style={styles.itemSubtotal}>
                                {formatCurrency(item.subtotal)}
                            </Text>
                        </View>
                    ))}
                </View>

                <View style={styles.calculationSection}>
                    <View style={styles.divider} />

                    <View style={styles.calcRow}>
                        <Text style={styles.calcLabel}>Tạm tính:</Text>
                        <Text style={styles.calcValue}>
                            {formatCurrency(subtotal)}
                        </Text>
                    </View>

                    <View style={styles.calcRow}>
                        <Text style={styles.calcLabel}>VAT (10%):</Text>
                        <Text style={styles.calcValue}>
                            {formatCurrency(vat)}
                        </Text>
                    </View>

                    <View style={[styles.divider, { marginVertical: 12 }]} />

                    <View style={styles.totalRow}>
                        <Text style={styles.totalLabel}>TỔNG CỘNG:</Text>
                        <Text style={styles.totalValue}>
                            {formatCurrency(total)}
                        </Text>
                    </View>
                </View>

                <View style={styles.footer}>
                    <Text style={styles.footerText}>
                        Cảm ơn quý khách đã mua hàng! 🎉
                    </Text>
                    <Text style={styles.footerNote}>* Giá đã bao gồm VAT</Text>
                </View>
            </ScrollView>

            <View style={styles.actionSection}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => router.back()}
                >
                    <Text style={styles.backButtonText}>← Quay lại</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.checkoutButton}
                    onPress={handleCheckout}
                >
                    <Text style={styles.checkoutButtonText}>Thanh toán ✓</Text>
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
    scrollView: { flex: 1 },
    header: { backgroundColor: "#fff", padding: 20, alignItems: "center" },
    headerTitle: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#333",
        marginBottom: 8,
    },
    invoiceDate: { fontSize: 14, color: "#666", marginBottom: 12 },
    divider: { width: "100%", height: 1, backgroundColor: "#e0e0e0" },
    itemsSection: { backgroundColor: "#fff", marginTop: 8, padding: 16 },
    tableHeader: {
        flexDirection: "row",
        paddingBottom: 12,
        borderBottomWidth: 1,
        borderBottomColor: "#e0e0e0",
        marginBottom: 8,
    },
    thIndex: { width: 40, fontSize: 14, fontWeight: "600", color: "#666" },
    thName: { flex: 1, fontSize: 14, fontWeight: "600", color: "#666" },
    thAmount: {
        width: 100,
        fontSize: 14,
        fontWeight: "600",
        color: "#666",
        textAlign: "right",
    },
    invoiceItem: {
        flexDirection: "row",
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: "#f0f0f0",
    },
    itemIndex: { width: 40, fontSize: 16, color: "#666" },
    itemDetails: { flex: 1 },
    itemName: {
        fontSize: 16,
        fontWeight: "500",
        color: "#333",
        marginBottom: 4,
    },
    itemQtyPrice: { fontSize: 14, color: "#666" },
    itemSubtotal: {
        width: 100,
        fontSize: 16,
        fontWeight: "600",
        color: "#007AFF",
        textAlign: "right",
    },
    calculationSection: { backgroundColor: "#fff", marginTop: 8, padding: 16 },
    calcRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingVertical: 8,
    },
    calcLabel: { fontSize: 16, color: "#666" },
    calcValue: { fontSize: 16, fontWeight: "500", color: "#333" },
    totalRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingVertical: 4,
    },
    totalLabel: { fontSize: 20, fontWeight: "bold", color: "#333" },
    totalValue: { fontSize: 24, fontWeight: "bold", color: "#FF3B30" },
    footer: {
        backgroundColor: "#fff",
        marginTop: 8,
        padding: 20,
        alignItems: "center",
    },
    footerText: {
        fontSize: 16,
        color: "#34C759",
        fontWeight: "600",
        marginBottom: 8,
    },
    footerNote: { fontSize: 12, color: "#999", fontStyle: "italic" },
    actionSection: {
        flexDirection: "row",
        backgroundColor: "#fff",
        padding: 16,
        gap: 12,
        borderTopWidth: 1,
        borderTopColor: "#e0e0e0",
    },
    backButton: {
        flex: 1,
        backgroundColor: "#8E8E93",
        padding: 16,
        borderRadius: 8,
        alignItems: "center",
    },
    backButtonText: { color: "#fff", fontSize: 16, fontWeight: "600" },
    checkoutButton: {
        flex: 2,
        backgroundColor: "#34C759",
        padding: 16,
        borderRadius: 8,
        alignItems: "center",
    },
    checkoutButtonText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
});
