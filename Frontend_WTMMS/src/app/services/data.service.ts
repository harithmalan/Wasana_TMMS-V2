import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { tap } from 'rxjs/operators';
import {
  User, InventoryItem, Customer, Supplier, Order,
  Notification, RevenueData, InventoryChartData, ForecastData, PieData
} from '../models/models';

@Injectable({ providedIn: 'root' })
export class DataService {

  private http = inject(HttpClient);

  // ── Chart / static data ──────────────────────────────────────────────────
  private _revenueData = signal<RevenueData[]>([]);
  readonly revenueData = this._revenueData.asReadonly();
  
  private _inventoryChartData = signal<InventoryChartData[]>([]);
  readonly inventoryChartData = this._inventoryChartData.asReadonly();
  
  private _aiForecastData = signal<ForecastData[]>([]);
  readonly aiForecastData = this._aiForecastData.asReadonly();
  
  private _pieData = signal<PieData[]>([]);
  readonly pieData = this._pieData.asReadonly();

  loadDashboardData() {
    this.http.get<any>(`${environment.apiUrl}/dashboard`).subscribe({
      next: (data) => {
        this._revenueData.set(data.revenueData);
        this._inventoryChartData.set(data.stockMix);
        this._pieData.set(data.stockMix.map((s: any) => ({ name: s.type, value: s.qty })));
      },
      error: (err) => console.error('Failed to load dashboard data', err)
    });
  }

  loadReportsData() {
    this.http.get<any>(`${environment.apiUrl}/reports`).subscribe({
      next: (data) => {
        this._revenueData.set(data.revenueData);
        this._inventoryChartData.set(data.stockData);
      },
      error: (err) => console.error('Failed to load reports data', err)
    });
  }

  loadAiData() {
    this.http.get<any>(`${environment.apiUrl}/ai/forecast`).subscribe({
      next: (data) => {
        this._aiForecastData.set(data.forecastData);
      },
      error: (err) => console.error('Failed to load AI data', err)
    });
  }

  readonly PIE_COLORS = ['#5C2E0E', '#3D7A54', '#C4853A', '#2E6B8A', '#8C6D52'];

  // ── Users ────────────────────────────────────────────────────────────────
  private _users = signal<User[]>([]);
  readonly users = this._users.asReadonly();

  loadUsers() {
    this.http.get<User[]>(`${environment.apiUrl}/users`).subscribe({
      next: (data) => this._users.set(data),
      error: (err) => console.error('Failed to load users', err)
    });
  }

  addUser(u: Omit<User, 'id' | 'lastLogin' | 'avatar'>) {
    // The backend CreateRequest might differ slightly, but we pass what we have
    return this.http.post<User>(`${environment.apiUrl}/users`, u).pipe(
      tap(newUser => {
        this._users.update(list => [...list, newUser]);
      })
    );
  }
  
  updateUser(updated: User) {
    return this.http.put<User>(`${environment.apiUrl}/users/${updated.id}`, updated).pipe(
      tap(newUser => {
        this._users.update(list => list.map(u => u.id === newUser.id ? newUser : u));
      })
    );
  }
  
  deleteUser(id: number) {
    return this.http.delete(`${environment.apiUrl}/users/${id}`).pipe(
      tap(() => {
        this._users.update(list => list.filter(u => u.id !== id));
      })
    );
  }

  // ── Inventory ────────────────────────────────────────────────────────────
  private _inventory = signal<InventoryItem[]>([]);
  readonly inventory = this._inventory.asReadonly();

  loadInventory() {
    this.http.get<InventoryItem[]>(`${environment.apiUrl}/inventory`).subscribe({
      next: (data) => this._inventory.set(data),
      error: (err) => console.error('Failed to load inventory', err)
    });
  }

  addInventoryItem(item: Omit<InventoryItem, 'id' | 'status'>) {
    return this.http.post<InventoryItem>(`${environment.apiUrl}/inventory`, item).pipe(
      tap(newItem => {
        this._inventory.update(list => [...list, newItem]);
      })
    );
  }
  
  updateInventoryItem(updated: InventoryItem) {
    return this.http.put<InventoryItem>(`${environment.apiUrl}/inventory/${updated.id}`, updated).pipe(
      tap(newItem => {
        this._inventory.update(list => list.map(i => i.id === newItem.id ? newItem : i));
      })
    );
  }
  
  deleteInventoryItem(id: string) {
    return this.http.delete(`${environment.apiUrl}/inventory/${id}`).pipe(
      tap(() => {
        this._inventory.update(list => list.filter(i => i.id !== id));
      })
    );
  }

  // ── Customers ────────────────────────────────────────────────────────────
  private _customers = signal<Customer[]>([]);
  readonly customers = this._customers.asReadonly();

  loadCustomers() {
    this.http.get<Customer[]>(`${environment.apiUrl}/customers`).subscribe({
      next: (data) => this._customers.set(data),
      error: (err) => console.error('Failed to load customers', err)
    });
  }

  addCustomer(c: Omit<Customer, 'id' | 'segment'>) {
    return this.http.post<Customer>(`${environment.apiUrl}/customers`, c).pipe(
      tap(newCustomer => {
        this._customers.update(list => [...list, newCustomer]);
      })
    );
  }
  
  updateCustomer(updated: Customer) {
    return this.http.put<Customer>(`${environment.apiUrl}/customers/${updated.id}`, updated).pipe(
      tap(newCustomer => {
        this._customers.update(list => list.map(c => c.id === newCustomer.id ? newCustomer : c));
      })
    );
  }
  
  deleteCustomer(id: number) {
    return this.http.delete(`${environment.apiUrl}/customers/${id}`).pipe(
      tap(() => {
        this._customers.update(list => list.filter(c => c.id !== id));
      })
    );
  }

  // ── Suppliers ────────────────────────────────────────────────────────────
  private _suppliers = signal<Supplier[]>([]);
  readonly suppliers = this._suppliers.asReadonly();

  loadSuppliers() {
    this.http.get<Supplier[]>(`${environment.apiUrl}/suppliers`).subscribe({
      next: (data) => this._suppliers.set(data),
      error: (err) => console.error('Failed to load suppliers', err)
    });
  }

  addSupplier(s: Omit<Supplier, 'id'>) {
    return this.http.post<Supplier>(`${environment.apiUrl}/suppliers`, s).pipe(
      tap(newSupplier => {
        this._suppliers.update(list => [...list, newSupplier]);
      })
    );
  }
  
  updateSupplier(updated: Supplier) {
    return this.http.put<Supplier>(`${environment.apiUrl}/suppliers/${updated.id}`, updated).pipe(
      tap(newSupplier => {
        this._suppliers.update(list => list.map(s => s.id === newSupplier.id ? newSupplier : s));
      })
    );
  }
  
  deleteSupplier(id: number) {
    return this.http.delete(`${environment.apiUrl}/suppliers/${id}`).pipe(
      tap(() => {
        this._suppliers.update(list => list.filter(s => s.id !== id));
      })
    );
  }

  // ── Orders ───────────────────────────────────────────────────────────────
  private _orders = signal<Order[]>([]);
  readonly orders = this._orders.asReadonly();

  loadOrders() {
    this.http.get<Order[]>(`${environment.apiUrl}/orders`).subscribe({
      next: (data) => this._orders.set(data),
      error: (err) => console.error('Failed to load orders', err)
    });
  }

  addOrder(o: Omit<Order, 'id'>) {
    return this.http.post<Order>(`${environment.apiUrl}/orders`, o).pipe(
      tap(newOrder => {
        this._orders.update(list => [...list, newOrder]);
      })
    );
  }
  
  updateOrder(updated: Order) {
    return this.http.put<Order>(`${environment.apiUrl}/orders/${updated.id}`, updated).pipe(
      tap(newOrder => {
        this._orders.update(list => list.map(o => o.id === newOrder.id ? newOrder : o));
      })
    );
  }
  
  deleteOrder(id: string) {
    return this.http.delete(`${environment.apiUrl}/orders/${id}`).pipe(
      tap(() => {
        this._orders.update(list => list.filter(o => o.id !== id));
      })
    );
  }

  // ── Notifications ────────────────────────────────────────────────────────
  private _notifications = signal<Notification[]>([]);
  readonly notifications = this._notifications.asReadonly();
  readonly unreadCount = computed(() => this._notifications().filter(n => !n.read).length);

  loadNotifications() {
    this.http.get<Notification[]>(`${environment.apiUrl}/notifications`).subscribe({
      next: (data) => this._notifications.set(data),
      error: (err) => console.error('Failed to load notifications', err)
    });
  }

  markAsRead(id: number) {
    return this.http.patch<Notification>(`${environment.apiUrl}/notifications/${id}/read`, {}).pipe(
      tap(() => {
        this._notifications.update(list => list.map(n => n.id === id ? { ...n, read: true } : n));
      })
    );
  }
  
  markAllRead() {
    return this.http.patch(`${environment.apiUrl}/notifications/read-all`, {}).pipe(
      tap(() => {
        this._notifications.update(list => list.map(n => ({ ...n, read: true })));
      })
    );
  }
}
