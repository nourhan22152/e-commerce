import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CategoryService } from '../../services/category';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.css']
})
export class Navbar {

  constructor(private router: Router) { }
  private categoryService = inject(CategoryService);

  isMenuOpen = false;
  categories: any[] = [];

  ngOnInit() {
    this.loadCategories();
  }


  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }
  loadCategories() {
    this.categoryService.getAll().subscribe((res: any) => {
      this.categories = res.data || res;  // حسب الريسبونس بتاعك
    });
  }

  goToCategory(id: string) {
    this.router.navigate(['/productsByCategory'], {
      queryParams: { id }
    });
    this.isMenuOpen = false;
  }
}
