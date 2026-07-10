import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Catogs } from '../../catogs/catogs';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [CommonModule,Catogs],
  templateUrl: './categories.html',
})
export class Categories {}