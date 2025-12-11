import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  private apiUrl = 'http://localhost:4000/cart/api';

  constructor(private http: HttpClient) {}

  // ➕ Add to cart
  addToCart(item: {
    productId: string,
    color: string,
    size: string,
    quantity: number,
    cartId?: string
  }) {
    return this.http.post(this.apiUrl, item);
  }

  // 🔄 Update quantity
  updateQuantity(data: {
    productId: string,
    color: string,
    size: string,
    quantity: number,
    cartId: string
  }) {
    return this.http.patch(this.apiUrl, data);
  }

  // 📦 Get cart
  getCart(cartId: string) {
    return this.http.get(`${this.apiUrl}?cartId=${cartId}`);
  }

  // ❌ Remove item
  deleteFromCart(data: {
    productId: string,
    color: string,
    size: string,
    cartId: string
  }) {
    return this.http.delete(this.apiUrl, { body: data });
  }
}
