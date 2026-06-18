import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductsService, ProductFilters } from '../../Core/Services/products-service';
import { CategoriesService } from '../../Core/Services/categories-services';
import { Product } from '../../Models/product.Model';
import { Category } from '../../Models/category.model';

@Component({
  selector: 'app-products-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './products.html',
})
export class Products implements OnInit {
  private productsService = inject(ProductsService);
  private categoriesService = inject(CategoriesService);

  products = signal<Product[]>([]);
  categories = signal<Category[]>([]);
  totalCount = signal(0);
  isLoading = signal(true);
  error = signal('');

  // Filter state
  selectedCategoryId = signal<string>('');
  minPrice = signal<number | null>(null);
  maxPrice = signal<number | null>(null);
  sortBy = signal<string>('Name');

  ngOnInit() {
    this.loadCategories();
    this.loadProducts();
  }

  loadCategories() {
    this.categoriesService.getCategories().subscribe({
      next: (res) => this.categories.set(res.data),
      error: () => {}
    });
  }

  loadProducts() {
    this.isLoading.set(true);
    this.error.set('');

    const filters: ProductFilters = {
      categoryId: this.selectedCategoryId() || undefined,
      minPrice: this.minPrice() ?? undefined,
      maxPrice: this.maxPrice() ?? undefined,
      sortBy: this.sortBy() || undefined,
      pageNumber: 1,
      pageSize: 20,
    };

    this.productsService.getProducts(filters).subscribe({
      next: (res) => {
        this.products.set(res.data.data);
        this.totalCount.set(res.data.totalCount);
        this.isLoading.set(false);
      },
      error: () => {
        this.error.set('Failed to load products');
        this.isLoading.set(false);
      }
    });
  }

  selectCategory(categoryId: string) {
    this.selectedCategoryId.set(categoryId);
    this.loadProducts();
  }

  applyFilters() {
    this.loadProducts();
  }

  onSortChange(value: string) {
    this.sortBy.set(value);
    this.loadProducts();
  }
}