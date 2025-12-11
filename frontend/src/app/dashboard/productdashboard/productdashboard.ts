import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ProductService } from '../../services/product';
import { CategoryService } from '../../services//category';
import { CommonModule, NgForOf } from '@angular/common';

@Component({
  selector: 'app-product',
  imports: [ReactiveFormsModule, CommonModule, NgForOf],
  templateUrl: './productdashboard.html',
  styleUrls: ['./productdashboard.css']
})
export class Productdashboard {

  productForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private categoryService: CategoryService
  ) {

    this.productForm = this.fb.group({
      name: [''],
      price: [''],
      category: [''],
      variants: this.fb.array([])
    });

    this.addVariant(); // أول variant
  }

  // GET VARIANTS ARRAY
  get variants() {
    return this.productForm.get('variants') as FormArray;
  }

  // GET SIZES ARRAY INSIDE ONE VARIANT
  getSizes(variantIndex: number) {
    return this.variants.at(variantIndex).get('sizes') as FormArray;
  }

  // ADD VARIANT
  addVariant() {
    this.variants.push(
      this.fb.group({
        color: [''],
        image: [null],
        sizes: this.fb.array([])
      })
    );

    this.addSize(this.variants.length - 1); // add first size automatically
  }
  categories: any[] = [];

  ngOnInit() {
    this.loadCategories();
  }

  loadCategories() {
    this.categoryService.getAll().subscribe({
      next: (res) => {
        console.log("Categories:", res);
        this.categories = res.data;   // ⭐ IMPORTANT
      },
      error: (err) => console.error(err)
    });
  }

  // REMOVE VARIANT
  removeVariant(i: number) {
    this.variants.removeAt(i);
  }

  // ADD SIZE INSIDE VARIANT
  addSize(variantIndex: number) {
    this.getSizes(variantIndex).push(
      this.fb.group({
        size: ['M'],  // default size
        stock: [0]   // default stock
      })
    );
  }

  // REMOVE SIZE
  removeSize(variantIndex: number, sizeIndex: number) {
    this.getSizes(variantIndex).removeAt(sizeIndex);
  }

  // SELECT IMAGE FOR VARIANT
  selectImage(variantIndex: number, event: any) {
    const file = event.target.files[0];
    this.variants.at(variantIndex).patchValue({ image: file });
  }

  // ⭐⭐ SUBMIT PRODUCT (FINAL & CORRECT)
  submitProduct() {

    if (this.productForm.invalid) {
      console.log("Form invalid");
      return;
    }

    const productData = this.productForm.value;

    console.log("SENDING PRODUCT:", productData);

    this.productService.addProduct(productData).subscribe({
      next: (res) => {
        console.log("Product Added:", res);
        alert("Product added successfully!");
      },
      error: (err) => {
        console.error("Add Product Error:", err);
        alert("Error adding product!");
      }
    });
  }
}
