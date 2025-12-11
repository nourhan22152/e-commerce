import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private http = inject(HttpClient);
  private baseUrl = 'http://localhost:4000/products/api';

  getAll() {
    return this.http.get(this.baseUrl);
  }

  getById(id: string) {
    return this.http.get(`${this.baseUrl}/${id}`);
  }

  getByCategory(categoryId: string) {
    return this.http.get(`${this.baseUrl}/by-category/${categoryId}`);
  }

  filter(params: any) {
    return this.http.get(`${this.baseUrl}/filter`, { params });
  }

 // ▶ ▶ Add Product (WITH IMAGES)
  addProduct(product: any) {
  const formData = new FormData();

  formData.append("name", product.name);
  formData.append("price", product.price.toString());
  formData.append("category", product.category);

  product.variants.forEach((v: any) => {
    if (v.image) formData.append("images", v.image);
  });

  const cleanVariants = product.variants.map((v: any) => ({
    color: v.color,
    sizes: v.sizes.map((s: any) => ({
      size: s.size,
      stock: Number(s.stock)
    }))
  }));

  formData.append("variants", JSON.stringify(cleanVariants));

  return this.http.post(this.baseUrl, formData);
}


  // Update Product
  update(id: string, product: any) {
    const formData = new FormData();

    formData.append("name", product.name);
    formData.append("price", product.price.toString());
    formData.append("category", product.category);

    product.variants.forEach((variant: any) => {
      if (variant.image instanceof File) {
        formData.append("images", variant.image);
      }
    });

    const cleanVariants = product.variants.map((v: any) => ({
      color: v.color,
      sizes: v.sizes,
      image: v.image // keep old image URL
    }));

    formData.append("variants", JSON.stringify(cleanVariants));

    return this.http.patch(`${this.baseUrl}/${id}`, formData);
  }
  delete(id: string) {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }
}
