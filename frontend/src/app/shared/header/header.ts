// header.component.ts
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, RouterModule } from '@angular/router';

import {  inject } from '@angular/core';
import { CategoryService } from '../../services/category';
import { AuthService } from '../../services/auth';
import { CommonModule, NgForOf } from '@angular/common';

@Component({
  selector: 'app-header',
  templateUrl: './header.html',
  styleUrls: ['./header.css'],
  imports: [CommonModule, NgForOf, RouterModule]
})
export class Header implements OnInit {

  categories: any[] = [];

  private categoryService = inject(CategoryService);
  private authService = inject(AuthService);
  private router = inject(Router);

  isAdmin = false;

  ngOnInit(): void {
    this.loadCategories();
    this.isAdmin = this.authService.getCustomer()?.role === "admin";
  }

  loadCategories() {
    this.categoryService.getAll().subscribe((res) => {
      this.categories = res.data; // ← هنا المهم
    });
  }
  goToCategory(id: string) {
  this.router.navigate(['/productsByCategory'], {
    queryParams: { id }
  });
}

}
