import { Component, OnInit } from '@angular/core';
import { OrderService } from '../../services/order';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-order',
  imports:[CommonModule, FormsModule],
  templateUrl: './order.html',
  styleUrls: ['./order.css']
})
export class Order implements OnInit {

  items: any[] = [];
  isLoggedIn = false;

  shippingAddress: any = {
    label: 'home',
    country: 'Egypt',
    city: '',
    street: '',
    building: '',
    floor: '',
    apartment: '',
    phone: '',
    notes: ''
  };

  paymentMethod = 'cash';

  guestInfo = {
    name: '',
    email: '',
    phone: ''
  };

  constructor(
    private orderService: OrderService,
    private http: HttpClient
  ) {}

  ngOnInit() {
    this.isLoggedIn = !!localStorage.getItem('token');

    const cartId = localStorage.getItem("cartId");

    if (!cartId) {
      alert("No cart found!");
      return;
    }

    this.http.get(`http://localhost:4000/cart/api?cartId=${cartId}`)
      .subscribe({
        next: (res: any) => {
          this.items = res.cart.items;
          console.log("Loaded cart items:", this.items);
        },
        error: (err) => {
          console.error(err);
        }
      });
  }

  submitOrder() {
    if (this.items.length === 0) {
      alert("Cart is empty!");
      return;
    }

    const orderData: any = {
      items: this.items,
      shippingAddress: this.shippingAddress,
      paymentMethod: this.paymentMethod
    };

    if (!this.isLoggedIn) {
      orderData.guestInfo = this.guestInfo;
    }

    this.orderService.createOrder(orderData).subscribe({
      next: (res: any) => {
        alert("Order placed successfully!");
        console.log(res);

        // Clear cart if needed
        // localStorage.removeItem("cartId");
      },
      error: (err) => {
        console.error(err);
        alert(err.error?.message || "Something went wrong");
      }
    });
  }


  getOrderTotal() {
  return this.items.reduce((sum, item) => sum + item.totalPrice, 0);
}
}
