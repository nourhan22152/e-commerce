import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'http://localhost:4000/api/customers';

  // =========================
  // 🔔 Customer State
  // =========================
  private customerSubject = new BehaviorSubject<any>(null);
  customer$ = this.customerSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadCustomerFromStorage();
  }

  // =========================
  // 🔐 TOKEN
  // =========================
  saveToken(token: string) {
    localStorage.setItem('token', token);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  // =========================
  // 🚪 LOGOUT
  // =========================
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('customer');
    this.customerSubject.next(null);
  }

  // =========================
  // 🔐 AUTH
  // =========================
  register(data: any) {
    return this.http.post(`${this.apiUrl}/register`, data).pipe(
      tap((res: any) => {
        this.saveToken(res.token);
        this.saveCustomer(res.customer);
      })
    );
  }

  login(data: any) {
    return this.http.post(`${this.apiUrl}/login`, data).pipe(
      tap((res: any) => {
        this.saveToken(res.token);
        this.saveCustomer(res.customer);
      })
    );
  }

  // =========================
  // 🧍 CUSTOMER STORAGE
  // =========================
  saveCustomer(customer: any) {
    localStorage.setItem('customer', JSON.stringify(customer));
    this.customerSubject.next(customer);
  }

  getCustomer() {
    const data = localStorage.getItem('customer');
    return data ? JSON.parse(data) : null;
  }

  loadCustomerFromStorage() {
    const customer = this.getCustomer();
    if (customer) {
      this.customerSubject.next(customer);
    }
  }

  // =========================
  // 👤 PROFILE
  // =========================
  getProfile() {
    return this.http.get(`${this.apiUrl}/profile`);
  }

  updateProfile(data: any) {
    return this.http.put(`${this.apiUrl}/profile`, data).pipe(
      tap((res: any) => {
        this.saveCustomer(res.customer);
      })
    );
  }

  // =========================
  // 🏠 ADDRESS
  // =========================
  addAddress(address: any) {
    return this.http.post(`${this.apiUrl}/address`, address);
  }

  updateAddress(index: number, address: any) {
    return this.http.put(`${this.apiUrl}/address/${index}`, address);
  }

  deleteAddress(index: number) {
    return this.http.delete(`${this.apiUrl}/address/${index}`);
  }

  // =========================
  // 🛡️ ADMIN
  // =========================
  getAllCustomers() {
    return this.http.get(`${this.apiUrl}`);
  }

  makeAdmin(customerId: string) {
    return this.http.put(`${this.apiUrl}/makeadmin/${customerId}`, {});
  }

  isAdmin(): boolean {
    const customer = this.getCustomer();
    return customer?.role === 'admin';
  }
}








// import { Injectable } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import { BehaviorSubject, tap } from 'rxjs';

// @Injectable({
//   providedIn: 'root'
// })
// export class AuthService {

//   private apiUrl = 'http://localhost:4000/api/customers';


//   // متابعة حالة اليوزر
//   private userData = new BehaviorSubject<any>(null);
//   customer$ = this.userData.asObservable();

//   constructor(private http: HttpClient) {
//     this.loadUserFromStorage();
//   }

//   // -------------------------
//   // 🔐 SAVE TOKEN
//   // -------------------------
//   saveToken(token: string) {
//     localStorage.setItem('token', token);
//   }

//   getToken() {
//     return localStorage.getItem('token');
//   }

//   logout() {
//     localStorage.removeItem('token');
//     localStorage.removeItem('customer');
//     this.userData.next(null);
//   }

//   // -------------------------
//   // 🔥 REGISTER
//   // -------------------------
//   register(data: any) {
//     return this.http.post(`${this.apiUrl}/register`, data).pipe(
//       tap((res: any) => {
//         this.saveToken(res.token);
//         this.saveCustomer(res.customer);
//       })
//     );
//   }

//   // -------------------------
//   // 🔥 LOGIN
//   // -------------------------
//   login(data: any) {
//     return this.http.post(`${this.apiUrl}/login`, data).pipe(
//       tap((res: any) => {
//         this.saveToken(res.token);
//         this.saveCustomer(res.customer);
//       })
//     );
//   }

//   // -------------------------
//   // 🧍 SAVE USER DATA
//   // -------------------------
//   saveCustomer(customer: any) {
//     localStorage.setItem("customer", JSON.stringify(customer));
//     this.userData.next(customer);
//   }

//   getCustomer() {
//     return JSON.parse(localStorage.getItem("customer") || "null");
//   }

//   loadUserFromStorage() {
//     const savedUser = this.getCustomer();
//     if (savedUser) this.userData.next(savedUser);
//   }

//   // -------------------------
//   // 👤 PROFILE
//   // -------------------------
//   getProfile() {
//     return this.http.get(`${this.apiUrl}/profile`);
//   }

//   updateProfile(data: any) {
//     return this.http.put(`${this.apiUrl}/profile`, data).pipe(
//       tap((res: any) => {
//         this.saveCustomer(res.customer);
//       })
//     );
//   }

//   // -------------------------
//   // 🏠 ADDRESS
//   // -------------------------
//   addAddress(address: any) {
//     return this.http.post(`${this.apiUrl}/address`, address);
//   }

//   updateAddress(index: number, address: any) {
//     return this.http.put(`${this.apiUrl}/address/${index}`, address);
//   }

//   deleteAddress(index: number) {
//     return this.http.delete(`${this.apiUrl}/address/${index}`);
//   }

//   isAdmin(): boolean {
//     const customer = this.getCustomer();
//     return customer?.role === "admin";
//   }

// }
