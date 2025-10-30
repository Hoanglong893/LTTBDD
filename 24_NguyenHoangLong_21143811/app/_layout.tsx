import { Stack } from 'expo-router';
import { useEffect } from 'react';
import { initDatabase } from '../db/initDB';

export default function Layout() {
  useEffect(() => {
    initDatabase();
  }, []);

  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: 'Danh mục' }} />
      <Stack.Screen name="category/[id]" options={{ title: 'Sản phẩm' }} />
      <Stack.Screen name="product/[id]" options={{ title: 'Chi tiết' }} />
      <Stack.Screen name="product/add" options={{ title: 'Thêm sản phẩm' }} />
      <Stack.Screen name="product/edit/[id]" options={{ title: 'Sửa sản phẩm' }} />
    </Stack>
  );
}