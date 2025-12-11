import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../services/product';
import { CategoryService } from '../../services/category';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class Home implements OnInit {

  private categoryService = inject(CategoryService);
  private productService = inject(ProductService);
  private router = inject(Router);

  categories: any[] = [];
  products: any[] = [];   // ⬅ مهم

  ngOnInit() {
    this.categoryService.getAll().subscribe((res: any) => {
      this.categories = res.data || res;
    });

    this.loadAllProducts(); // ⬅ تحميل المنتجات
  }

  loadAllProducts() {
    this.productService.getAll().subscribe((res: any) => {
      this.products = res.data || res;
    });
  }

  goToCategory(id: string) {
    this.router.navigate(['/productsByCategory'], {
      queryParams: { id }
    });
  }

  openProduct(id: string, event: Event) {
    event.stopPropagation();
    this.router.navigate(['/product', id]);
  }

  filters: any = {
    min: null,
    max: null,
    category: null,
    color: null,
    size: null
  };

  colors = ["red", "black", "white", "blue", "brown", "pink"];
  sizes = ["S", "M", "L", "XL"];

  showCategory = true;
  showColor = true;
  showSize = true;

  constructor() { }

applyFilter(type: string, value: any) {

  // لو اختار All أو اختار قيمة فاضية → شيل فلتر النوع ده فقط
  if (value === "" || value === null) {
    this.filters[type] = null;
  } else {
    this.filters[type] = value;
  }

  this.loadFilteredProducts();
}


  loadFilteredProducts() {
    const params: any = {};

    if (this.filters.min) params.min = this.filters.min;
    if (this.filters.max) params.max = this.filters.max;
    if (this.filters.category) params.category = this.filters.category;
    if (this.filters.color) params.color = this.filters.color;
    if (this.filters.size) params.size = this.filters.size;

    this.productService.filter(params).subscribe((res: any) => {
      this.products = res;
    });
  }

  toggleCategory() { this.showCategory = !this.showCategory; }
  toggleColor() { this.showColor = !this.showColor; }
  toggleSize() { this.showSize = !this.showSize; }

}
