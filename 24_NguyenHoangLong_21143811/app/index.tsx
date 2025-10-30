import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import { getAllCategories } from '../db/queries';
import { syncData, lightPullData } from '../utils/sync';
import { Category } from '../types';

export default function Home() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [syncing, setSyncing] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    loadCategories();
    // Auto pull nhẹ khi mở app
    handleLightPull();
  }, []);

  const loadCategories = async (): Promise<void> => {
    const data = await getAllCategories();
    setCategories(data);
  };

  const handleLightPull = async (): Promise<void> => {
    try {
      const result = await lightPullData();
      if (result.pulled > 0) {
        await loadCategories();
      }
    } catch (error) {
      console.log('Light pull skipped (no network)');
    }
  };

  const handleSync = async (): Promise<void> => {
    setSyncing(true);
    try {
      const result = await syncData();
      
      const catMsg = `Categories - Pushed: ${result.categories.pushed}, Pulled: ${result.categories.pulled}, Failed: ${result.categories.failed}`;
      const prodMsg = `Products - Pushed: ${result.products.pushed}, Pulled: ${result.products.pulled}, Deleted: ${result.products.deleted}, Failed: ${result.products.failed}`;
      
      Alert.alert(
        'Đồng bộ hoàn tất',
        `${catMsg}\n${prodMsg}`,
        [{ text: 'OK', onPress: loadCategories }]
      );
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể đồng bộ. Kiểm tra kết nối mạng.');
    } finally {
      setSyncing(false);
    }
  };

  const renderCategory = ({ item }: { item: Category }) => (
    <TouchableOpacity
      style={styles.categoryItem}
      onPress={() => router.push(`/category/${item.id}`)}
    >
      <Text style={styles.categoryName}>{item.name}</Text>
      <Text style={styles.arrow}>›</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.syncButton}
        onPress={handleSync}
        disabled={syncing}
      >
        {syncing ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.syncButtonText}>🔄 Sync Now</Text>
        )}
      </TouchableOpacity>

      <FlatList
        data={categories}
        renderItem={renderCategory}
        keyExtractor={(item) => item.id.toString()}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  syncButton: {
    backgroundColor: '#9b59b6',
    padding: 15,
    margin: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  syncButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  categoryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  categoryName: {
    fontSize: 18,
    fontWeight: '500',
  },
  arrow: {
    fontSize: 24,
    color: '#999',
  },
});