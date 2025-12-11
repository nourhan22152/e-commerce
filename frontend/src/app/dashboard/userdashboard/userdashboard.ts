import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../services/admin-service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-userdashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './userdashboard.html',
  styleUrls: ['./userdashboard.css']
})
export class Userdashboard implements OnInit {

  users: any[] = [];
  loading = false;

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.getUsers();
  }

  // ---------------------------
  // ✔ GET ALL USERS
  // ---------------------------
  getUsers() {
    this.loading = true;
    this.adminService.getAllUsers().subscribe({
      next: (res: any) => {
        this.users = res.users;
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
      this.getUsers(); // refresh list
    });
  }

  // ---------------------------
  // ✔ DELETE USER (optional)
  // ---------------------------
  deleteUser(id: string) {
    if (!confirm("Are you sure you want to delete this user?")) return;

    this.adminService.deleteUser(id).subscribe(() => {
      this.getUsers(); // refresh after delete
    });
  }

}
