import { Component } from '@angular/core';
import { Hero } from "./hero/hero";
import { Categories } from "./categories/categories";
import { WhyChoose } from "./why-choose/why-choose";
import { StayUpdated } from "./stay-updated/stay-updated";
import { FeaturedProducts } from "./featured-products/featured-products";
import { Footer } from "../footer/footer";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [Hero, Categories, WhyChoose, StayUpdated, FeaturedProducts, Footer],
  templateUrl: './home.html'
})
export class Home {}
