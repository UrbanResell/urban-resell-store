import { Timestamp } from 'firebase/firestore';

export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  imageUrl: string;
  createdAt: Timestamp;
}

export interface Order {
  id: string;
  productId: string;
  productName: string;
  customerName: string;
  phone: string;
  address: string;
  status: 'Pending' | 'Contacted';
  createdAt: Timestamp;
}

export interface Admin {
  id: string;
  email: string;
}
