import axios from 'axios';
import {
  getAllCategoriesForSync,
  getAllProductsForSync,
  getDeletedProducts,
  updateCategoryRemoteId,
  updateProductRemoteId,
  insertCategoryFromRemote,
  updateCategoryFromRemote,
  insertProductFromRemote,
  updateProductFromRemote,
  hardDeleteProduct,
  getCategoryByRemoteId,
  getProductByRemoteId,
} from '../db/queries';
import { SyncResult, RemoteCategory, RemoteProduct } from '../types';

const API_URL = 'https://6902b452b208b24affe6e6b7.mockapi.io';

const api = axios.create({
  baseURL: API_URL,
  timeout: 30000,
});

export const syncData = async (): Promise<SyncResult> => {
  const result: SyncResult = {
    categories: { pushed: 0, pulled: 0, failed: 0 },
    products: { pushed: 0, pulled: 0, deleted: 0, failed: 0 },
  };

  try {
    // 1. Sync Categories trước
    await syncCategories(result);
    
    // 2. Sync Products sau
    await syncProducts(result);
    
    return result;
  } catch (error) {
    console.error('Sync error:', error);
    throw error;
  }
};

// Sync categories
const syncCategories = async (result: SyncResult): Promise<void> => {
  // PUSH local -> remote
  const localCategories = await getAllCategoriesForSync();
  
  for (const local of localCategories) {
    try {
      if (!local.remote_id) {
        // Chưa có trên remote -> tạo mới
        const response = await api.post<RemoteCategory>('/categories', {
          name: local.name,
          updatedAt: local.updated_at,
        });
        
        await updateCategoryRemoteId(local.id, response.data.id, response.data.updatedAt);
        result.categories.pushed++;
      } else {
        // Đã có trên remote -> so sánh updated_at
        const remote = await api.get<RemoteCategory>(`/categories/${local.remote_id}`);
        
        if (new Date(local.updated_at) > new Date(remote.data.updatedAt)) {
          // Local mới hơn -> push lên remote
          await api.put(`/categories/${local.remote_id}`, {
            name: local.name,
            updatedAt: local.updated_at,
          });
          result.categories.pushed++;
        }
      }
    } catch (error) {
      result.categories.failed++;
      console.error('Push category error:', error);
    }
  }
  
  // PULL remote -> local
  try {
    const response = await api.get<RemoteCategory[]>('/categories');
    const remoteCategories = response.data;
    
    for (const remote of remoteCategories) {
      try {
        const local = await getCategoryByRemoteId(remote.id);
        
        if (!local) {
          // Chưa có local -> tạo mới
          await insertCategoryFromRemote({
            name: remote.name,
            id: remote.id,
            updatedAt: remote.updatedAt,
          });
          result.categories.pulled++;
        } else {
          // Đã có local -> so sánh updatedAt
          if (new Date(remote.updatedAt) > new Date(local.updated_at)) {
            // Remote mới hơn -> pull về local
            await updateCategoryFromRemote(local.id, {
              name: remote.name,
              updatedAt: remote.updatedAt,
            });
            result.categories.pulled++;
          }
        }
      } catch (error) {
        result.categories.failed++;
        console.error('Pull category error:', error);
      }
    }
  } catch (error) {
    result.categories.failed++;
    console.error('Fetch remote categories error:', error);
  }
};

// Sync products
const syncProducts = async (result: SyncResult): Promise<void> => {
  // XÓA products đã đánh dấu is_deleted=1
  const deletedProducts = await getDeletedProducts();
  
  for (const product of deletedProducts) {
    if (product.remote_id) {
      try {
        await api.delete(`/products/${product.remote_id}`);
        await hardDeleteProduct(product.id);
        result.products.deleted++;
      } catch (error) {
        result.products.failed++;
        console.error('Delete product error:', error);
      }
    }
  }
  
  // PUSH local -> remote
  const localProducts = await getAllProductsForSync();
  
  for (const local of localProducts) {
    try {
      // Tìm remote_id của category
      const localCategories = await getAllCategoriesForSync();
      const category = localCategories.find(c => c.id === local.category_id);
      
      if (!category || !category.remote_id) {
        result.products.failed++;
        continue;
      }
      
      if (!local.remote_id) {
        // Chưa có trên remote -> tạo mới
        const response = await api.post<RemoteProduct>('/products', {
          name: local.name,
          price: local.price,
          unit: local.unit,
          description: local.description || '',
          image_uri: local.image_uri || '',
          categoryId: category.remote_id,
          updatedAt: local.updated_at,
        });
        
        await updateProductRemoteId(local.id, response.data.id, response.data.updatedAt);
        result.products.pushed++;
      } else {
        // Đã có trên remote -> so sánh updated_at
        const remote = await api.get<RemoteProduct>(`/products/${local.remote_id}`);
        
        if (new Date(local.updated_at) > new Date(remote.data.updatedAt)) {
          // Local mới hơn -> push lên remote
          await api.put(`/products/${local.remote_id}`, {
            name: local.name,
            price: local.price,
            unit: local.unit,
            description: local.description || '',
            image_uri: local.image_uri || '',
            categoryId: category.remote_id,
            updatedAt: local.updated_at,
          });
          result.products.pushed++;
        }
      }
    } catch (error) {
      result.products.failed++;
      console.error('Push product error:', error);
    }
  }
  
  // PULL remote -> local
  try {
    const response = await api.get<RemoteProduct[]>('/products');
    const remoteProducts = response.data;
    
    for (const remote of remoteProducts) {
      try {
        const local = await getProductByRemoteId(remote.id);
        
        // Tìm local category_id từ remote categoryId
        const remoteCategory = await getCategoryByRemoteId(remote.categoryId);
        if (!remoteCategory) {
          result.products.failed++;
          continue;
        }
        
        if (!local) {
          // Chưa có local -> tạo mới
          await insertProductFromRemote(remote, remoteCategory.id);
          result.products.pulled++;
        } else {
          // Đã có local -> so sánh updatedAt
          if (new Date(remote.updatedAt) > new Date(local.updated_at)) {
            // Remote mới hơn -> pull về local
            await updateProductFromRemote(local.id, remote);
            result.products.pulled++;
          }
        }
      } catch (error) {
        result.products.failed++;
        console.error('Pull product error:', error);
      }
    }
  } catch (error) {
    result.products.failed++;
    console.error('Fetch remote products error:', error);
  }
};

// ======== LIGHT PULL (tự động khi mở app) ========
export const lightPullData = async (): Promise<{ pulled: number }> => {
  let pulled = 0;
  
  try {
    // Pull categories
    const categoriesRes = await api.get<RemoteCategory[]>('/categories');
    for (const remote of categoriesRes.data) {
      const local = await getCategoryByRemoteId(remote.id);
      if (!local) {
        await insertCategoryFromRemote({
          name: remote.name,
          id: remote.id,
          updatedAt: remote.updatedAt,
        });
        pulled++;
      }
    }
    
    // Pull products
    const productsRes = await api.get<RemoteProduct[]>('/products');
    for (const remote of productsRes.data) {
      const local = await getProductByRemoteId(remote.id);
      if (!local) {
        const remoteCategory = await getCategoryByRemoteId(remote.categoryId);
        if (remoteCategory) {
          await insertProductFromRemote(remote, remoteCategory.id);
          pulled++;
        }
      }
    }
  } catch (error) {
    console.log('Light pull failed (no network)');
  }
  
  return { pulled };
};