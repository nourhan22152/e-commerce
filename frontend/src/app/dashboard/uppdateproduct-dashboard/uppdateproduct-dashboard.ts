import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../services/product';
import { CategoryService } from '../../services/category';

@Component({
  selector: 'app-update-product',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './uppdateproduct-dashboard.html',
  styleUrls: ['./uppdateproduct-dashboard.css']
})
export class UppdateproductDashboard implements OnInit {

  productForm!: FormGroup;
  productId!: string;
  categories: any[] = [];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private productService: ProductService,
    private categoryService: CategoryService
  ) {}

  ngOnInit() {
    this.productId = this.route.snapshot.paramMap.get("id")!;
    this.loadCategories();
    this.loadProduct();
  }

  loadCategories() {
    this.categoryService.getAll().subscribe((res: any) => {
      this.categories = res.data;
    });
  }

  loadProduct() {
    this.productService.getById(this.productId).subscribe((p: any) => {
      this.initForm(p);
    });
  }

  initForm(p: any) {
    this.productForm = this.fb.group({
      name: [p.name],
      price: [p.price],
      category: [p.category],
      variants: this.fb.array([])
    });

    p.variants.forEach((v: any) => {
      const FG = this.fb.group({
        color: [v.color],
        image: [v.image],
        sizes: this.fb.array([])
      });

      v.sizes.forEach((s: any) => {
        (FG.get('sizes') as FormArray).push(
          this.fb.group({
            size: [s.size],
            stock: [s.stock]
          })
        );
      });

      this.variants.push(FG);
    });
  }

  get variants() {
    return this.productForm.get('variants') as FormArray;
  }

  getSizes(i: number) {
    return this.variants.at(i).get('sizes') as FormArray;
  }

  selectImage(i: number, event: any) {
    const file = event.target.files[0];
    if (file) {
      this.variants.at(i).patchValue({ image: file });
    }
  }

  isOldImage(image: any): boolean {
    return typeof image === 'string';
  }

  updateProduct() {
    this.productService.update(this.productId, this.productForm.value).subscribe({
      next: () => alert("Product updated successfully!"),
      error: err => console.log(err)
    });
  }
}
