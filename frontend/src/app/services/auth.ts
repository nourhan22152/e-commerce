import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'http://localhost:4000/users/api';

  // متابعة حالة اليوزر
  private userData = new BehaviorSubject<any>(null);
  user$ = this.userData.asObservable();

  constructor(private http: HttpClient) {
    this.loadUserFromStorage();
  }

  // -------------------------
  // 🔐 SAVE TOKEN
  // -------------------------
  saveToken(token: string) {
    localStorage.setItem('token', token);
  }

  getToken() {
    return localStorage.getItem('token');
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.userData.next(null);
  }

  // -------------------------
  // 🔥 REGISTER
  // -------------------------
  register(data: any) {
    return this.http.post(`${this.apiUrl}/register`, data).pipe(
      tap((res: any) => {
        this.saveToken(res.token);
        this.saveUser(res.user);
      })
    );
  }

  // -------------------------
  // 🔥 LOGIN
  // -------------------------
  login(data: any) {
    return this.http.post(`${this.apiUrl}/login`, data).pipe(
      tap((res: any) => {
        this.saveToken(res.token);
        this.saveUser(res.user);
      })
    );
  }

  // -------------------------
  // 🧍 SAVE USER DATA
  // -------------------------
  saveUser(user: any) {
    localStorage.setItem("user", JSON.stringify(user));
    this.userData.next(user);
  }

  getUser() {
    return JSON.parse(localStorage.getItem("user") || "null");
  }

  loadUserFromStorage() {
    const savedUser = this.getUser();
    if (savedUser) this.userData.next(savedUser);
  }

  // -------------------------
  // 👤 PROFILE
  // -------------------------
  getProfile() {
    return this.http.get(`${this.apiUrl}/profile`);
  }

  updateProfile(data: any) {
    return this.http.put(`${this.apiUrl}/profile`, data).pipe(
      tap((res: any) => {
        this.saveUser(res.user);
      })
    );
  }

  // -------------------------
  // 🏠 ADDRESS
  // -------------------------
  addAddress(address: any) {
    return this.http.post(`${this.apiUrl}/address`, address);
  }

  updateAddress(index: number, address: any) {
    return this.http.put(`${this.apiUrl}/address/${index}`, address);
  }

  deleteAddress(index: number) {
    return this.http.delete(`${this.apiUrl}/address/${index}`);
  }

  isAdmin(): boolean {
  const user = this.getUser();
  return user?.role === "admin";
}

}
