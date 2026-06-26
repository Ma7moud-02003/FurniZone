import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductsService } from '../../../Core/Services/products-service';
import { Product } from '../../../Models/product.Model';
import { RouterLink } from "@angular/router";
import { ProductCard } from '../../Cards/product-card/product-card';

@Component({
  selector: 'app-featured-products',
  standalone: true,
  imports: [CommonModule, RouterLink,ProductCard],
  templateUrl: './featured-products.html',
})
export class FeaturedProducts implements OnInit {
  private productsService = inject(ProductsService);

  products = signal<Product[]>([]);
  isLoading = signal(true);
  error = signal('');

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts() {
   this.productsService.getProducts({ pageNumber: 1, pageSize: 8 }).subscribe({
      next: (res) => {
        this.products.set(res.data.data);
        console.log(res.data.data);
        
        this.isLoading.set(false);
      },
      error: () => {
        this.error.set('Failed to load products');
        this.isLoading.set(false);
      }
    });
  }
}