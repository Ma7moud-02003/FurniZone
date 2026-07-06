import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-stay-updated',
  standalone:true,
  imports: [CommonModule, RouterLink],
  templateUrl: './stay-updated.html',
})
export class StayUpdated {}
