import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ProductService } from '../../services/product';

@Component({
  selector: 'app-products-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './edit-products-dashboard.html',
  styleUrls: ['./edit-products-dashboard.css']
})
export class EditProductsDashboard implements OnInit {

  products: any[] = [];

  constructor(private productService: ProductService) {}

  ngOnInit() {
    this.loadProducts();
  }

  loadProducts() {
    this.productService.getAll().subscribe((res: any) => {
      this.products = res.data ?? res;
    });
  }

  deleteProduct(id: string) {
    if (!confirm("Are you sure?")) return;

    this.productService.delete(id).subscribe(() => {
      alert("Product deleted!");
      this.loadProducts();
    });
  }
}
