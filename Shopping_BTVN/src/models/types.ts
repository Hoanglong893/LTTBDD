export interface Product {
  product_id: string;
  name: string;
  price: number;
  stock: number;
}

export interface CartItem {
  id: number;
  product_id: string;
  qty: number;
}

export interface CartItemWithProduct extends CartItem {
  name: string;
  price: number;
  stock: number;
  subtotal: number;
}

export interface Invoice {
  items: CartItemWithProduct[];
  subtotal: number;
  vat: number;
  total: number;
  date: string;
}

export interface InvoiceItem {
  product_id: string;
  name: string;
  qty: number;
  price: number;
  subtotal: number;
}