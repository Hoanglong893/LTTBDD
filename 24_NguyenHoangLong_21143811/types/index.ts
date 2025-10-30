export interface Category {
  id: number;
  name: string;
  remote_id: string | null;
  updated_at: string;
}

export interface Product {
  id: number;
  name: string;
  price: number;
  unit: string;
  description: string | null;
  image_uri: string | null;
  category_id: number;
  remote_id: string | null;
  updated_at: string;
  is_deleted: number;
}

export interface RemoteCategory {
  id: string;
  name: string;
  updatedAt: string;
}

export interface RemoteProduct {
  id: string;
  name: string;
  price: number;
  unit: string;
  description: string;
  image_uri: string;
  categoryId: string;
  updatedAt: string;
}

export interface SyncResult {
  categories: {
    pushed: number;
    pulled: number;
    failed: number;
  };
  products: {
    pushed: number;
    pulled: number;
    deleted: number;
    failed: number;
  };
}