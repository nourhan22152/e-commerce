import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../../services/product';
import { CommonModule, NgFor } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule,NgFor],
  templateUrl: './products.html',
  styleUrls: ['./products.css'],
})
export class Products implements OnInit {

  private route = inject(ActivatedRoute);
  private productService = inject(ProductService);

  private router = inject(Router);
  products: any[] = [];
  categoryId: string | null = null;

  ngOnInit() {
    console.log('123');

    this.route.queryParamMap.subscribe(params => {
      this.categoryId = params.get('id');


      if (this.categoryId) {
        this.loadByCategory();
      } else {
        this.loadAllProducts();
      }
    });
  }

  loadAllProducts() {
    this.productService.getAll().subscribe((res: any) => {
      this.products = res.data || res; // بناءً على API الـ backend
    });
  }

  loadByCategory() {
    this.productService.getByCategory(this.categoryId!).subscribe((res: any) => {
      this.products = res.data || res;
    });
  }


  goToDetails(id: string) {
    this.router.navigate(['/product', id]);
  }
}
