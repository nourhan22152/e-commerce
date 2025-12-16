import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {

  constructor(private router: Router) {}

  canActivate(): boolean {

    // 1) هتجيبي بيانات اليوزر من localStorage
    const customer = localStorage.getItem("customer");

    if (!customer) {
      this.router.navigate(['/login']);
      return false;
    }

    const parsedUser = JSON.parse(customer);

    // 2) لو مش Admin → منمنع الدخول
    if (parsedUser.role !== "admin") {
      this.router.navigate(['/not-authorized']); // أو الصفحة المناسبة
      return false;
    }

    // 3) لو Admin → يسمح بالدخول
    return true;
  }

}
