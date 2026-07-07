import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProductsService } from '../Services/product-service';
import { Product } from '../Models/product.model';
import { Subscription } from 'rxjs';
import { Alerts } from '../../Core/Services/alerts';
import { Category } from '../../Models/category.model';
import { CategoriesService } from '../../Core/Services/categories-services';

@Component({
  selector: 'app-admin-products',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './products.html',
})
export class Products implements OnInit , OnDestroy{
  private productsService = inject(ProductsService);
  private fb = inject(FormBuilder);
   private subs=new Subscription();
   private alerts=inject(Alerts);
  products = signal<Product[]>([]);
  categories = signal<Category[]>([]);
  
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
    Image:    ['', Validators.required],
  });

  ngOnInit() {
    this.loadProducts();
  }
  private categoryService=inject(CategoriesService);

  loadCategories(): void {
    this.subs.add(this.categoryService.getCategories().subscribe({
      next: (data:any) => {
      this.categories.set(data.data);
      this.showModal.set(true);

      },
    }));
  }


  loadProducts() {
    this.isLoading.set(true);
    this.subs.add(this.productsService.getProducts({ pageNumber: 1, pageSize: 100 }).subscribe({
      next: (res) => {
        console.log(res);
        
        this.products.set(res.data.data);
        this.isLoading.set(false);
      },
      error: () => {
        this.error.set('Failed to load products');
        this.isLoading.set(false);
      }
    }));
  }

  openAddModal() {
    this.isEditing.set(false);
    this.productForm.reset({ name: '', description: '', price: 0, stock: 0, categoryId: '', imageUrl: '' });
    this.loadCategories();
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
      Image:    product.imageUrl,
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
    formData.append('Image', f.Image);
  console.log(this.productForm.value);
  console.log(formData);
  
  
    // const request$ = this.isEditing()
    //   ? this.productsService.updateProduct(this.editingId(), formData)
    //   : this.productsService.addProduct(formData);

    // this.subs.add(request$.subscribe({
    //   next: () => {
    //     this.isSubmitting.set(false);
    //     this.alerts.showSuccess('Product added successfully');
    //     this.closeModal();
    //     this.loadProducts();
    //   },
    //   error: (err) => {
    //     console.error('Error:', err);
    //     this.isSubmitting.set(false);
    //   }
    // }));
  }

  confirmDelete(id: string) {
    this.deletingId.set(id);
    this.showDeleteConfirm.set(true);
  }

  cancelDelete() {
    this.showDeleteConfirm.set(false);
  }

  deleteProduct() {
    this.subs.add(this.productsService.deleteProduct(this.deletingId()).subscribe({
      next: () => {
        this.showDeleteConfirm.set(false);
        this.alerts.showSuccess('Product Deleted successfully');

        this.loadProducts();
      },
      error: (err) => console.error('Delete error:', err)
    }));
  }
  ngOnDestroy(): void {
    this.subs.unsubscribe()
  }
}