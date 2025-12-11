import { Component, OnInit } from '@angular/core';
import { OrderService } from '../../services/order';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-orders',
  imports:[RouterLink,CommonModule],
  templateUrl: './orderdashboard.html',
  styleUrls: ['./orderdashboard.css']
})
export class Orderdashboard implements OnInit {

  orders: any[] = [];

  constructor(private orderService: OrderService) {}

  ngOnInit() {
    this.loadOrders();
  }

  loadOrders() {
    this.orderService.getAllOrders().subscribe({
      next: (res: any) => {
        this.orders = res.orders;
        console.log(this.orders);
      },
      error: (err) => {
        console.error(err);
      }
    });
  }
}
