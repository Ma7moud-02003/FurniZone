import { Component, computed, inject, signal } from '@angular/core';
import { OrderService } from '../Services/order-service';
import { Alerts } from '../../Core/Services/alerts';
import { Order, OrderFilters, OrderStatus } from '../Models/order.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface StatusOption {
  label: string;
  value: OrderStatus;
}
@Component({
  selector: 'app-orders',
  imports: [CommonModule,FormsModule],
  templateUrl: './orders.html',
  styleUrl: './orders.css',
})
export class Orders {
  
  private readonly ordersService = inject(OrderService);
  private readonly alertService = inject(Alerts);
 
  // ----- State -----
  orders = signal<Order[]>([]);
  loading = signal<boolean>(false);
  error = signal<boolean>(false);
 
  pageNumber = signal<number>(1);
  pageSize = signal<number>(10);
  totalPages = signal<number>(1);
  totalCount = signal<number>(0);
 
  hasOrders = computed(() => this.orders().length > 0);
  pageSizeOptions: number[] = [10, 20, 50, 100];
 
  pages = computed<number[]>(() => {
    const total = this.totalPages();
    return Array.from({ length: total }, (_, i) => i + 1);
  });
 
  
  filters: OrderFilters = this.getDefaultFilters();
 
  statusOptions: StatusOption[] = [
    { label: 'Pending', value: OrderStatus.Pending },
    { label: 'Confirmed', value: OrderStatus.Confirmed },
    { label: 'Shipped', value: OrderStatus.Shipped },
    { label: 'Delivered', value: OrderStatus.Delivered },
  ];
 
  // ----- Update Status Modal -----
  isStatusModalOpen = signal<boolean>(false);
  selectedOrder = signal<Order | null>(null);
  selectedStatus = signal<OrderStatus>(OrderStatus.Pending);
  updating = signal<boolean>(false);
 
  ngOnInit(): void {
    this.loadOrders();
  }
 
  private getDefaultFilters(): OrderFilters {
    return {
      status: null,
      userId: '',
      fromDate: '',
      toDate: '',
      sortBy: '',
      sortDescending: false,
      pageNumber: 1,
      pageSize: 10,
    };
  }
 
  // ----- Data loading -----
  loadOrders(): void {
    this.loading.set(true);
    this.error.set(false);
 
    const requestFilters: OrderFilters = {
      ...this.filters,
      pageNumber: this.pageNumber(),
      pageSize: this.pageSize(),
    };
 
    this.ordersService.getOrders(requestFilters).subscribe({
      next: (result:any) => {
        console.log(result);
        const data=result.data.data;
        this.orders.set(data);
        this.totalPages.set(result.totalPages || 1);
        this.totalCount.set(result.totalCount || 0);
        this.loading.set(false);
      },
     
    });
  }
 
  retryLoad(): void {
    this.loadOrders();
  }
 
  // ----- Filter actions -----
  search(): void {
    this.pageNumber.set(1);
    this.loadOrders();
  }
 
  resetFilters(): void {
    this.filters = this.getDefaultFilters();
    this.pageNumber.set(1);
    this.pageSize.set(10);
    this.loadOrders();
  }
 
  // ----- Pagination -----
  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages() || page === this.pageNumber()) {
      return;
    }
    this.pageNumber.set(page);
    this.loadOrders();
  }
 
  previousPage(): void {
    this.goToPage(this.pageNumber() - 1);
  }
 
  nextPage(): void {
    this.goToPage(this.pageNumber() + 1);
  }
 
  onPageSizeChange(size: number): void {
    this.pageSize.set(size);
    this.pageNumber.set(1);
    this.loadOrders();
  }
 
  // ----- Update Status Modal -----
  openStatusModal(order: Order): void {
    this.selectedOrder.set(order);
    this.selectedStatus.set(order.status);
    this.isStatusModalOpen.set(true);
  }
 
  closeStatusModal(): void {
    this.isStatusModalOpen.set(false);
    this.selectedOrder.set(null);
    this.updating.set(false);
  }
 
  saveStatus(): void {
    const order = this.selectedOrder();
    if (!order) {
      return;
    }
 
    this.updating.set(true);
 
    this.ordersService.updateOrderStatus(order.id, this.selectedStatus()).subscribe({
      next: () => {
        this.alertService.showSuccess('Order status updated successfully.');
        this.updating.set(false);
        this.closeStatusModal();
        this.loadOrders();
      },
      
    });
  }
 
  // ----- Helpers -----
  getStatusLabel(status: OrderStatus): string {
    switch (status) {
      case OrderStatus.Pending:
        return 'Pending';
      case OrderStatus.Confirmed:
        return 'Confirmed';
      case OrderStatus.Shipped:
        return 'Shipped';
      case OrderStatus.Delivered:
        return 'Delivered';
      default:
        return 'Unknown';
    }
  }
 
  getStatusClass(status: OrderStatus): string {
    switch (status) {
      case OrderStatus.Pending:
        return 'bg-yellow-100 text-yellow-700 border border-yellow-300';
      case OrderStatus.Confirmed:
        return 'bg-blue-100 text-blue-700 border border-blue-300';
      case OrderStatus.Shipped:
        return 'bg-purple-100 text-purple-700 border border-purple-300';
      case OrderStatus.Delivered:
        return 'bg-green-100 text-green-700 border border-green-300';
      default:
        return 'bg-gray-100 text-gray-700 border border-gray-300';
    }
  }
 
  formatDate(dateString: string): string {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return '-';
    }
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }
}
