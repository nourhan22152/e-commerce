import { Component, OnInit } from '@angular/core';
import { CartService } from '../../services/cart';
import { CommonModule, NgForOf, NgIf } from '@angular/common';
import { Router } from '@angular/router';


@Component({
  selector: 'app-cart',
  templateUrl: './cart.html',
  styleUrls: ['./cart.css'],
  imports: [CommonModule, NgForOf, NgIf]
})


export class Cart implements OnInit {

  cartItems: any[] = [];
  cartId: string = '';




  constructor(private cartService: CartService, private router: Router) { }


  goToCheckout() {
    this.router.navigate(['/orders']);
  }

  ngOnInit(): void {
    this.cartId = localStorage.getItem("cartId") || "";
    if (this.cartId) {
      this.loadCart();
    }
  }

  // 🔄 تحميل السلة
  loadCart() {
    this.cartService.getCart(this.cartId).subscribe((res: any) => {
      this.cartItems = res.cart.items;
      this.cartId = res.cartId;

      // لو cartId جديد اتخزن
      localStorage.setItem("cartId", this.cartId);
    });
  }

  // 🔄 تعديل الكمية
  updateQuantity(item: any, newQty: number) {
    if (newQty < 1) return;

    const payload = {
      productId: item.productId,
      color: item.color,
      size: item.size,
      quantity: newQty,
      cartId: this.cartId
    };

    this.cartService.updateQuantity(payload).subscribe(() => {
      item.quantity = newQty;
      item.totalPrice = item.price * newQty;
    });
  }

  // ❌ حذف منتج
  removeItem(item: any) {
    const payload = {
      productId: item.productId,
      color: item.color,
      size: item.size,
      cartId: this.cartId
    };

    this.cartService.deleteFromCart(payload).subscribe(() => {
      this.cartItems = this.cartItems.filter(
        cartItem =>
          !(
            cartItem.productId === item.productId &&
            cartItem.color === item.color &&
            cartItem.size === item.size
          )
      );
    });
  }

  // 💰 حساب إجمالي السلة
  get cartTotal() {
    return this.cartItems.reduce((sum, item) => sum + item.totalPrice, 0);
  }
}
