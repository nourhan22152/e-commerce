import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  private apiUrl = 'http://localhost:4000/orders/api';

  constructor(private http: HttpClient) { }

  private getAuthHeaders() {
    const token = localStorage.getItem('token'); // أو المكان اللي بتخزن فيه التوكن

    return {
      headers: new HttpHeaders({
        Authorization: `Bearer ${token}`
      })
    };
  }


  createOrder(orderData: any) {
    return this.http.post(this.apiUrl, orderData, this.getAuthHeaders());
  }


  cancelOrder(orderId: string) {
    return this.http.put(`${this.apiUrl}/${orderId}/cancel`, {}, this.getAuthHeaders());
  }


  updateOrderStatus(orderId: string, status: string) {
    return this.http.put(
      `${this.apiUrl}/${orderId}/status`,
      { status },
      this.getAuthHeaders()
    );
  }


  getUserOrders() {
    return this.http.get(`${this.apiUrl}/customer`, this.getAuthHeaders());
  }

  getAllOrders() {
    return this.http.get(this.apiUrl, this.getAuthHeaders());
  }
  getOrderById(orderId: string) {
    return this.http.get(`${this.apiUrl}/${orderId}`, this.getAuthHeaders());
  }



}
