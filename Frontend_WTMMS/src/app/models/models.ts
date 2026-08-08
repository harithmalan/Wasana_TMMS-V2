export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  status: string;
  lastLogin: string;
  avatar: string;
}

export interface InventoryItem {
  id: string;
  type: string;
  grade: string;
  qty: number;
  unit: string;
  price: number;
  status: string;
  location: string;
  reorder: number;
}

export interface Customer {
  id: number;
  name: string;
  contact: string;
  email: string;
  phone: string;
  city: string;
  totalOrders: number;
  totalSpend: number;
  rating: number;
  segment: string;
}

export interface Supplier {
  id: number;
  name: string;
  country: string;
  contact: string;
  email: string;
  phone: string;
  rating: number;
  onTime: number;
  materials: string;
  lastOrder: string;
  status: string;
}

export interface Order {
  id: string;
  customer: string;
  items: string;
  amount: number;
  date: string;
  status: string;
  payment: string;
}

export interface Notification {
  id: number;
  type: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
}

export interface RevenueData {
  month: string;
  revenue: number;
  expenses: number;
  profit: number;
}

export interface InventoryChartData {
  type: string;
  qty: number;
  value: number;
}

export interface ForecastData {
  week: string;
  actual: number | null;
  predicted: number;
  demand: number;
}

export interface PieData {
  name: string;
  value: number;
}
