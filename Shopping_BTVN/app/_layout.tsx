import { useEffect } from "react";
import { Stack } from "expo-router";
import { initDatabase, seedProducts} from "../src/db/db";

export default function RootLayout() {
    useEffect(() => {
        const setupDatabase = async () => {
            try {
                await initDatabase();
                await seedProducts();
                console.log("✅ Database setup completed");
            } catch (error) {
                console.error("❌ Error setting up database:", error);
            }
        };

        setupDatabase();
    }, []);

    return (
        <Stack
            screenOptions={{
                headerStyle: {
                    backgroundColor: "#007AFF",
                },
                headerTintColor: "#fff",
                headerTitleStyle: {
                    fontWeight: "bold",
                },
            }}
        >
            <Stack.Screen
                name="index"
                options={{
                    title: "🛍️ Danh Sách Sản Phẩm",
                    headerShown: true,
                }}
            />
            <Stack.Screen
                name="cart"
                options={{
                    title: "🛒 Giỏ Hàng",
                    headerShown: true,
                }}
            />
            <Stack.Screen
                name="invoice"
                options={{
                    title: "🧾 Hoá Đơn",
                    headerShown: true,
                }}
            />
        </Stack>
    );
}
