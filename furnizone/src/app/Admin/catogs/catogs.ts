import { Component, computed, inject, signal } from '@angular/core';
import { CatService } from '../Services/cat-service';
import { Alerts } from '../../Core/Services/alerts';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Category } from '../../Models/category.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-catogs',
  imports: [ReactiveFormsModule,CommonModule],
  templateUrl: './catogs.html',
  styleUrl: './catogs.css',
})
export class Catogs {
  
  private readonly categoryService = inject(CatService);
  private readonly alertService = inject(Alerts);
  private readonly fb = inject(FormBuilder);
 
  

  categories = signal<Category[]>([]);
  loading = signal<boolean>(false);
  error = signal<boolean>(false);
  saving = signal<boolean>(false);
 
  isModalOpen = signal<boolean>(false);
  editingId = signal<string | null>(null);
 
  isDeleteModalOpen = signal<boolean>(false);
  deletingCategory = signal<Category | null>(null);
  deleting = signal<boolean>(false);
 
  isEditMode = computed(() => this.editingId() !== null);
  hasCategories = computed(() => this.categories().length > 0);
  // ----- Form -----
  categoryForm: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
  });
 
  ngOnInit(): void {
    this.loadCategories();
  }
 
  // ----- Data loading -----
  loadCategories(): void {
    this.loading.set(true);
    this.error.set(false);
 
    this.categoryService.getCategories().subscribe({
      next: (data:any) => {
        this.categories.set(data.data);
        this.loading.set(false);
      },
      error: () => {
        this.error.set(true);
        this.loading.set(false);
        this.alertService.showError('Failed to load categories.');
      },
    });
  }
 
  retryLoad(): void {
    this.loadCategories();
  }
 
  // ----- Modal handling -----
  openAddModal(): void {
    this.editingId.set(null);
    this.categoryForm.reset({ name: '' });
    this.isModalOpen.set(true);
  }
 
  openEditModal(category: Category): void {
    this.editingId.set(category.id);
    this.categoryForm.reset({ name: category.name });
    this.isModalOpen.set(true);
  }
 
  closeModal(): void {
    this.isModalOpen.set(false);
    this.editingId.set(null);
    this.saving.set(false)
    this.categoryForm.reset({ name: '' });
  }
 
 
  get nameControl() {
    return this.categoryForm.get('name');
  }






  // ----- Delete handling -----
  openDeleteModal(category: Category): void {
    this.deletingCategory.set(category);
    this.isDeleteModalOpen.set(true);
  }
 
  closeDeleteModal(): void {
    this.isDeleteModalOpen.set(false);
    this.deletingCategory.set(null);
  }
 
  confirmDelete(): void {
    const category = this.deletingCategory();
    if (!category) {
      return;
    }
 
    this.deleting.set(true);
 
    this.categoryService.deleteCategory(category.id).subscribe({
      next: () => {
        this.alertService.showSuccess('Category deleted successfully.');
        this.deleting.set(false);
        this.closeDeleteModal();
        this.loadCategories();
      },
      
    });
  }


 
  // ----- Save (Add or Update) -----
  saveCategory(): void {
    if (this.categoryForm.invalid) {
      this.categoryForm.markAllAsTouched();
      return;
    }
 
    const name: string = this.categoryForm.value.name.trim();
    this.saving.set(true);
    const id = this.editingId();
    if (id !== null) {
      this.categoryService.updateCategory(id, name).subscribe({
        next: () => {
          this.alertService.showSuccess('Category updated successfully.');
          this.saving.set(false);
          this.closeModal();
          this.loadCategories();
        },
        error: () => {
          this.saving.set(false);
          this.alertService.showError('Failed to update category.');
        },
      });
    } else {
      this.categoryService.addCategory(name).subscribe({
        next: () => {
          this.alertService.showSuccess('Category added successfully.');
          this.saving.set(false);
          this.closeModal();
          this.loadCategories();
        },
        // error: () => {
        //   this.saving.set(false);
        //   this.alertService.showSuccess('Failed to add category.');
        // },
      });
    }
  }
}
