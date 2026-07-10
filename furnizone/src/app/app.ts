import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Nav } from './Components/nav/nav';
import { Footer } from './Components/footer/footer';
import { UserRole } from './Admin/enums/role.enum';
import { Auth } from './Core/Services/auth';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet,Nav,Footer],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit{
  private auth=inject(Auth);
  roles=UserRole;

  role=signal<string>('');
ngOnInit(): void {
  this.role=this.auth.role;
}

  protected readonly title = signal('furnizone');
}
