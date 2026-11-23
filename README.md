# FurniZone | Furniture E-Commerce

<img src="docs/screenshot.png" alt="FurniZone storefront homepage with product search, shopping navigation and furniture branding" width="100%" />

A modern furniture e-commerce frontend built with **Angular**. Customers can browse furniture by category, manage a cart and wishlist, place orders and leave reviews, while admins manage the catalog from a protected dashboard.

This is a **team graduation project**. This repository holds the Angular frontend (in `furnizone/`) along with the project's analysis and design documents.

## Features

- User authentication (register / login) with route guards
- Browse products and categories, with a product details page
- Shopping cart, wishlist and checkout
- Order history and personal product reviews
- Admin dashboard protected by an admin guard
- Lazy-loaded routes and toast notifications (ngx-toastr)

## Tech Stack

- **Framework:** Angular 21 (standalone components), TypeScript
- **Styling:** Tailwind CSS
- **State / HTTP:** RxJS, Angular HttpClient with interceptors
- **UI feedback:** ngx-toastr

## Getting Started

The Angular app lives in the `furnizone/` folder:

```bash
cd furnizone
npm install
npm start
```

Then open `http://localhost:4200/`.

The app consumes a REST API; its base URL is configured in `furnizone/src/environments/environment.ts`.

## Project Structure

```
furnizone/src/app/
├── Admin/          # admin dashboard (guard-protected)
├── Components/     # auth, home, products, cart, wishlist, checkout, orders, reviews
├── Core/           # shared services
├── Guards/         # auth and admin route guards
├── Interceptors/   # HTTP interceptors
└── Models/         # TypeScript models
```

Project documents (idea, requirements, system analysis & design, UI and team responsibilities) are included as PDFs in the repository root.

## Team & Contributions

Graduation team project. **Mahmoud Amr**: Angular frontend, responsive pages, reusable components and REST API integration for products, orders, reviews and authentication.
