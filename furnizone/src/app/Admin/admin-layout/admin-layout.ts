import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Sidebar } from '../sidebar/sidebar';

@Component({
  selector: 'app-admin-layout',
  imports: [RouterModule,Sidebar],
  templateUrl: './admin-layout.html',
  styleUrl: './admin-layout.css',
})
export class AdminLayout {}
