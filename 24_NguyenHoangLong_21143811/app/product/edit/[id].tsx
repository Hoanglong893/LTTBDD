import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView, ActivityIndicator } from 'react-native';
import { useState, useEffect } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { getProductById, updateProduct } from '../../../db/queries';

export default function EditProduct() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  
  const [loading, setLoading] = useState<boolean>(true);
  const [name, setName] = useState<string>('');
  const [price, setPrice] = useState<string>('');
  const [unit, setUnit] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [imageUri, setImageUri] = useState<string>('');

  useEffect(() => {
    if (id) {
      loadProduct();
    }
  }, [id]);

  const loadProduct = async (): Promise<void> => {
    const product = await getProductById(parseInt(id));
    if (product) {
      setName(product.name);
      setPrice(product.price.toString());
      setUnit(product.unit);
      setDescription(product.description || '');
      setImageUri(product.image_uri || '');
    }
    setLoading(false);
  };

  const handleSubmit = async (): Promise<void> => {
    // Validate
    if (!name.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập tên sản phẩm');
      return;
    }
    
    const priceNum = parseFloat(price);
    if (isNaN(priceNum) || priceNum <= 0) {
      Alert.alert('Lỗi', 'Giá phải là số dương');
      return;
    }
    
    if (!unit.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập đơn vị');
      return;
    }

    try {
      await updateProduct(parseInt(id), {
        name: name.trim(),
        price: priceNum,
        unit: unit.trim(),
        description: description.trim(),
        image_uri: imageUri.trim(),
      } as any);
      
      Alert.alert('Thành công', 'Đã cập nhật sản phẩm', [
        { text: 'OK', onPress: () => router.back() }
      ]);
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể cập nhật sản phẩm');
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3498db" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.form}>
        <Text style={styles.label}>Tên sản phẩm *</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Nhập tên sản phẩm"
        />

        <Text style={styles.label}>Giá *</Text>
        <TextInput
          style={styles.input}
          value={price}
          onChangeText={setPrice}
          placeholder="Nhập giá"
          keyboardType="numeric"
        />

        <Text style={styles.label}>Đơn vị *</Text>
        <TextInput
          style={styles.input}
          value={unit}
          onChangeText={setUnit}
          placeholder="VD: chiếc, cái, hộp..."
        />

        <Text style={styles.label}>Mô tả</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={description}
          onChangeText={setDescription}
          placeholder="Nhập mô tả sản phẩm"
          multiline
          numberOfLines={4}
        />

        <Text style={styles.label}>URL hình ảnh</Text>
        <TextInput
          style={styles.input}
          value={imageUri}
          onChangeText={setImageUri}
          placeholder="https://..."
        />

        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Cập nhật</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  form: {
    padding: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 15,
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  submitButton: {
    backgroundColor: '#f39c12',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 30,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});