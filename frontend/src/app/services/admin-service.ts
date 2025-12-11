import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  private apiUrl = 'http://localhost:4000/users/api';

  constructor(private http: HttpClient) {}

  // ----------------------------------------
  // ✔ GET ALL USERS (ADMIN ONLY)
  // ----------------------------------------
  getAllUsers(): Observable<any> {
    return this.http.get(`${this.apiUrl}`);
  }

  // ----------------------------------------
  // ✔ MAKE USER ADMIN
  // ----------------------------------------
  makeAdmin(id: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/makeadmin/${id}`, {});
  }

  // ----------------------------------------
  // ✔ OPTIONAL: DELETE USER (لو عايزة تضيفيها)
  // ----------------------------------------
  deleteUser(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
