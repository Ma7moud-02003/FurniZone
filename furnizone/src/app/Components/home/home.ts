import { Component } from '@angular/core';
import { Hero } from "./hero/hero";
import { Categories } from "./categories/categories";
import { WhyChoose } from "./why-choose/why-choose";
import { StayUpdated } from "./stay-updated/stay-updated";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [Hero, Categories, WhyChoose, StayUpdated],
  templateUrl: './home.html'
})
export class Home {}
