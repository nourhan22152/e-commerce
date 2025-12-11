import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OrderService } from '../../services/order';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-order-details',
  imports:[FormsModule, CommonModule],
  templateUrl: './order-details.html',
  styleUrls: ['./order-details.css']
})
export class OrderDetails implements OnInit {

  orderId!: string;
  order: any = null;

  statuses = ["pending", "confirmed", "shipped", "delivered", "cancelled"];

  constructor(
    private route: ActivatedRoute,
    private orderService: OrderService
  ) {}

  ngOnInit() {
    this.orderId = this.route.snapshot.paramMap.get("id")!;
    this.loadOrder();
  }

  loadOrder() {
    this.orderService.getOrderById(this.orderId).subscribe({
      next: (res: any) => {
        this.order = res.order;
        console.log("Order Details:", this.order);
      },
      error: (err) => console.error(err)
    });
  }

  updateStatus(newStatus: string) {
    this.orderService.updateOrderStatus(this.orderId, newStatus).subscribe({
      next: (res: any) => {
        alert("Order status updated!");
        this.loadOrder(); // refresh
      },
      error: (err) => {
        alert(err.error?.message || "Status update failed");
      }
    });
  }
}
