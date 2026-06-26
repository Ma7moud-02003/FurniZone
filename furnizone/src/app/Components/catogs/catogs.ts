import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
interface Category {
  id: string;
  name: string;
  description: string;
 
}
@Component({
  selector: 'app-catogs',
  imports: [],
  templateUrl: './catogs.html',
  styleUrl: './catogs.css',
})
export class Catogs {
  private router = inject(Router);

categories = signal<Category[]>([
    {
      id: 'living-room',
      name: 'Living Room',
      description: 'Comfortable living room furniture'
    },
    {
      id: 'bedroom',
      name: 'Bedroom',
      description: 'Bedroom furniture and accessories'
    },
    {
      id: 'dining-room',
      name: 'Dining Room',
      description: 'Dining tables and chairs'
    },
    {
      id: 'office',
      name: 'Office',
      description: 'Home office furniture'
    },
    {
      id: 'outdoor',
      name: 'Outdoor',
      description: 'Outdoor and patio furniture'
    }
  ]);

  navigateToProducts(categoryId: string) {
    this.router.navigate(['/products'], { queryParams: { category: categoryId } });
  }
}
