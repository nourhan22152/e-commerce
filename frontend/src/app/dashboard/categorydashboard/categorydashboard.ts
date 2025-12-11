import { Component, OnInit } from '@angular/core';
import { CategoryService } from '../../services/category';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-category-dashboard',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './categorydashboard.html',
  styleUrls: ['./categorydashboard.css']
})
export class Categorydashboard implements OnInit {

  categories: any[] = [];
  form!: FormGroup;
  selectedImage: File | null = null;
  isEdit = false;
  editId: string | null = null;

  constructor(
    private categoryService: CategoryService,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.loadCategories();

    this.form = this.fb.group({
      name: ['', Validators.required],
      description: ['']
    });
  }

  // Load all categories
  loadCategories() {
    this.categoryService.getAll().subscribe({
      next: (res) => {
        
        console.log("Categories:", res);
        this.categories = res.data;
      },
      error: (err) => console.error(err)
    });
  }


  // When user selects an image
  onImageSelected(event: any) {
    this.selectedImage = event.target.files[0];
  }

  // Create or Update category
  submitForm() {
    if (this.form.invalid) return;

    const formData = this.form.value;

    if (!this.isEdit) {
      // CREATE
      this.categoryService.create(formData, this.selectedImage!).subscribe({
        next: () => {
          alert("Category added successfully");
          this.resetForm();
          this.loadCategories();
        },
        error: (err) => console.error(err)
      });
    } else {
      // UPDATE
      this.categoryService.update(this.editId!, formData, this.selectedImage!).subscribe({
        next: () => {
          alert("Category updated successfully");
          this.resetForm();
          this.loadCategories();
        },
        error: (err) => console.error(err)
      });
    }
  }

  // Fill form for editing
  editCategory(cat: any) {
    this.isEdit = true;
    this.editId = cat._id;

    this.form.patchValue({
      name: cat.name,
      description: cat.description
    });
  }

  // DELETE
  deleteCategory(id: string) {
    if (!confirm("Are you sure you want to delete this category?")) return;

    this.categoryService.delete(id).subscribe({
      next: () => {
        alert("Category deleted");
        this.loadCategories();
      },
      error: (err) => console.error(err)
    });
  }

  resetForm() {
    this.form.reset();
    this.isEdit = false;
    this.editId = null;
    this.selectedImage = null;
  }
}
