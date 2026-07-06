import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProductsService } from '../Services/product-service';
import { Product } from '../Models/product.model';

@Component({
  selector: 'app-admin-products',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './products.html',
})
export class Products implements OnInit {
  private productsService = inject(ProductsService);
  private fb = inject(FormBuilder);

  products = signal<Product[]>([]);
  isLoading = signal(true);
  error = signal('');

  showModal = signal(false);
  isEditing = signal(false);
  isSubmitting = signal(false);
  editingId = signal<string>('');

  showDeleteConfirm = signal(false);
  deletingId = signal<string>('');

  productForm: FormGroup = this.fb.group({
    name:        ['', Validators.required],
    description: ['', Validators.required],
    price:       [0, [Validators.required, Validators.min(0)]],
    stock:       [0, [Validators.required, Validators.min(0)]],
    categoryId:  ['', Validators.required],
    imageUrl:    ['', Validators.required],
  });

  ngOnInit() {
    this.loadProducts();
  }

  loadProducts() {
    this.isLoading.set(true);
    this.productsService.getProducts({ pageNumber: 1, pageSize: 100 }).subscribe({
      next: (res) => {
        this.products.set(res.data.data);
        this.isLoading.set(false);
      },
      error: () => {
        this.error.set('Failed to load products');
        this.isLoading.set(false);
      }
    });
  }

  openAddModal() {
    this.isEditing.set(false);
    this.productForm.reset({ name: '', description: '', price: 0, stock: 0, categoryId: '', imageUrl: '' });
    this.showModal.set(true);
  }

  openEditModal(product: Product) {
    this.isEditing.set(true);
    this.editingId.set(product.id);
    this.productForm.patchValue({
      name:        product.name,
      description: product.description,
      price:       product.price,
      stock:       product.stock,
      categoryId:  product.categoryId,
      imageUrl:    product.imageUrl,
    });
    this.showModal.set(true);
  }

  closeModal() {
    this.showModal.set(false);
  }

  submitForm() {
    if (this.productForm.invalid) return;
    this.isSubmitting.set(true);

    const f = this.productForm.value;
    const formData = new FormData();
    formData.append('Name', f.name);
    formData.append('Description', f.description);
    formData.append('Price', f.price.toString());
    formData.append('Stock', f.stock.toString());
    formData.append('CategoryId', f.categoryId);
    formData.append('Image', f.imageUrl);

    const request$ = this.isEditing()
      ? this.productsService.updateProduct(this.editingId(), formData)
      : this.productsService.addProduct(formData);

    request$.subscribe({
      next: () => {
        this.isSubmitting.set(false);
        this.closeModal();
        this.loadProducts();
      },
      error: (err) => {
        console.error('Error:', err);
        this.isSubmitting.set(false);
      }
    });
  }

  confirmDelete(id: string) {
    this.deletingId.set(id);
    this.showDeleteConfirm.set(true);
  }

  cancelDelete() {
    this.showDeleteConfirm.set(false);
  }

  deleteProduct() {
    this.productsService.deleteProduct(this.deletingId()).subscribe({
      next: () => {
        this.showDeleteConfirm.set(false);
        this.loadProducts();
      },
      error: (err) => console.error('Delete error:', err)
    });
  }
}