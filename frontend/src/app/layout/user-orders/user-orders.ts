import { Component, OnInit } from '@angular/core';
import { OrderService } from '../../services/order';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-orders',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-orders.html',
  styleUrls: ['./user-orders.css']
})
export class UserOrdersComponent implements OnInit {

  orders: any[] = [];
  loading = true;

  constructor(private orderService: OrderService) {}

  ngOnInit() {
    this.loadOrders();
  }

  loadOrders() {
    this.orderService.getUserOrders().subscribe({
      next: (res: any) => {
        this.orders = res.orders || [];
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
        alert(err.error?.message || "Error loading orders");
      }
    });
  }

  cancelOrder(orderId: string) {
    if (!confirm("Are you sure you want to cancel this order?")) return;

    this.orderService.cancelOrder(orderId).subscribe({
      next: (res: any) => {
        alert("Order cancelled successfully");
        this.loadOrders();
      },
      error: (err) => {
        console.error(err);

        // هنا هتيجي الرسالة اللي من الباك
        alert(err.error?.message || "Cannot cancel this order");
      }
    });
  }
}
