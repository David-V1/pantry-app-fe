import { Recipe } from '../Recipe';

export interface IngredientDTO {
    id: number | null;
    name: string;
    weight: number;
    quantity: number;
    metric: string;
    recipes: Recipe;
}