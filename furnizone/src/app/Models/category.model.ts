export interface Category {
  id: string;
  name: string;
}

export interface CategoriesApiResponse {
  success: boolean;
  message: string;
  data: Category[];
  errors: string[];
}