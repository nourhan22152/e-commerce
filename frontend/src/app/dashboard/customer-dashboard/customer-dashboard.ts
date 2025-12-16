import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../services/admin-service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-customer-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './customer-dashboard.html',
  styleUrls: ['./customer-dashboard.css']
})
export class Customerdashboard implements OnInit {

  customers: any[] = [];
  loading = false;

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.getCustomers();
  }

  // ---------------------------
  // ✔ GET ALL USERS
  // ---------------------------
  getCustomers() {
    this.loading = true;
    this.adminService.getAllCustomers().subscribe({
      next: (res: any) => {
        this.customers = res.customers;
        this.loading = false;
      },
      error: (err) => {
        console.log(err);
        this.loading = false;
      }
    });
  }

  // ---------------------------
  // ✔ MAKE USER ADMIN
  // ---------------------------
  makeAdmin(id: string) {
    this.adminService.makeAdmin(id).subscribe(() => {
      this.getCustomers(); // refresh list
    });
  }

  // ---------------------------
  // ✔ DELETE USER (optional)
  // ---------------------------
  deleteCustomer(id: string) {
    if (!confirm("Are you sure you want to delete this customer?")) return;

    this.adminService. deleteCustomer(id).subscribe(() => {
      this.getCustomers(); // refresh after delete
    });
  }

}
