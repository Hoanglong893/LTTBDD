import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import { useState } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { addProduct } from '../../db/queries';

export default function AddProduct() {
  const { categoryId } = useLocalSearchParams<{ categoryId: string }>();
  const router = useRouter();
  
  const [name, setName] = useState<string>('');
  const [price, setPrice] = useState<string>('');
  const [unit, setUnit] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [imageUri, setImageUri] = useState<string>('https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400');

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
        await addProduct({
        name: name.trim(),
        price: priceNum,
        unit: unit.trim(),
        description: description.trim(),
        image_uri: imageUri.trim(),
        category_id: parseInt(categoryId),
      });
      
      Alert.alert('Thành công', 'Đã thêm sản phẩm mới', [
        { text: 'OK', onPress: () => router.back() }
      ]);
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể thêm sản phẩm');
    }
  };

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
          <Text style={styles.submitButtonText}>Thêm sản phẩm</Text>
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
    backgroundColor: '#27ae60',
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