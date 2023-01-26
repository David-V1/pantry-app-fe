import { Injectable } from '@angular/core';
import { UiService } from './ui.service';
import { Recipe } from '../models/Recipe';
import { HttpClient } from '@angular/common/http';
import { PageName } from '../enums/PageEnum';
import { map, Observable, Subject, take, tap } from 'rxjs';
import { Ingredient } from '../models/Ingredient';
import { IngredientDTO } from '../models/modelsDTO/IngredientDTO';
import { RecipeDTO } from '../models/modelsDTO/RecipeDTO';

@Injectable({
  providedIn: 'root'
})
export class RecipeService {
  public pageName = PageName;
  public recipes: Recipe[] = [];
  public recipesDTO: RecipeDTO[] = [];
  public ingredients: any[] = [];
  public recipeVolumeOptions: string[] = ['liters', 'milliliters', 'gallons', 'fluid ounces', 'grams' ,'kilograms', 'pounds', 'ounces'];
  selectedRecipe = Number(localStorage.getItem('selectedRecipeId')) || null;

  private recipeSubject: Subject<Recipe> = new Subject();
  public recipe$: Observable<Recipe> = this.recipeSubject.asObservable();

  private recipesSubject: Subject<Recipe[]> = new Subject();
  public recipes$: Observable<Recipe[]> = this.recipesSubject.asObservable();

  private recipesDTOSubject: Subject<RecipeDTO[]> = new Subject();
  public recipesDTO$: Observable<RecipeDTO[]> = this.recipesDTOSubject.asObservable();

  private recipeSubjectDTO: Subject<RecipeDTO> = new Subject();
  public recipeDTO$: Observable<RecipeDTO> = this.recipeSubjectDTO.asObservable();

  private ingredientsSubject: Subject<IngredientDTO[]> = new Subject();
  public ingredients$: Observable<IngredientDTO[]> = this.ingredientsSubject.asObservable();

  private url = 'http://localhost:8080/recipe';
  private ingredientsURL = 'http://localhost:8080/ingredient';

  constructor(public ui: UiService, public http: HttpClient) {
    this.getRecipes();
    this.getAllIngredients();
   }

  // POST
  userId = Number(localStorage.getItem('userAccountId'))
  public addRecipe(recipe: Recipe): void {
    this.http.post<Recipe>(`${this.url}/${this.userId}`, recipe)
    .pipe(take(1))
    .subscribe({
      next: recipe => {
        this.recipeSubject.next(recipe);
        this.getRecipes();
      },
      error: err => {
        console.log(err);
        this.ui.onError('Error adding recipe');
      }})
  }

  public addRecipeDTO(recipe: RecipeDTO): void {
    this.http.post<RecipeDTO>(`${this.url}/${this.userId}`, recipe)
    .pipe(take(1))
    .subscribe({
      next: recipe => {
        // this.recipeSubject.next(recipe);
        this.recipeSubjectDTO.next(recipe);
        // this.getRecipes();
        this.getRecipesDTO();
      },
      error: err => {
        console.log(err);
        this.ui.onError('Error adding recipe');
      }})
  }
  

  public addIngredientsToRecipe(recipeId: number, ingredients: Ingredient): void {
    this.http.post<Ingredient>(`${this.ingredientsURL}/recipeId/${recipeId}`, ingredients)
    .pipe(take(1))
    .subscribe({
      next: () => {
        this.getRecipes();
      },
      error: err => {
        console.log(err);
        this.ui.onError('Error adding ingredients to recipe');
      }})
  }


  // GET
  public getRecipes(): void{
    this.http.get<Recipe[]>(`${this.url}`)
    .pipe(take(1))
    .subscribe({
      next: recipes => {
        this.recipes = recipes;
        this.recipesSubject.next(this.recipes);
      },
      error: err => {
        console.log(err);
        this.ui.onError('Error getting recipes');
      }
    })
  }

  public getRecipesDTO(): void{
    this.http.get<RecipeDTO[]>(`${this.url}`)
    .pipe(take(1))
    .subscribe({
      next: recipes => {
        // this.recipes = recipes;
        this.recipesDTO = recipes;
        this.recipesDTOSubject.next(recipes);
      },
      error: err => {
        console.log(err);
        this.ui.onError('Error getting recipes');
      }
    })
  }

  public getRecipeById(id: number): void {
    //persist selected recipe
    localStorage.setItem('selectedRecipeId', JSON.stringify(id));
    this.http.get<Recipe>(`${this.url}/${id}`)
    .pipe(take(1))
    .subscribe({
      next: recipe => {
        this.recipeSubject.next(recipe);
      },
      error: err => {
        console.log(err);
        this.ui.onError('Error getting recipe');
      }
    })
  }

  public getAllIngredients(): void {
    this.http.get<IngredientDTO[]>(`${this.ingredientsURL}`)
    .pipe(take(1))
    .subscribe({
      next: ingredients => {
        this.ingredients = ingredients;
        this.ingredientsSubject.next(ingredients);
      },
      error: err => {
        console.log(err);
        this.ui.onError('Error getting ingredients');
      }
    })
  }

  public whenRecipeUpdate(): Observable<Recipe> {
    return this.recipe$;
  }

  // PUT
  public updateIngredient(ingredientId:number ,ingredient: Ingredient): void {
    this.http.put<Ingredient>(`${this.ingredientsURL}/${ingredientId}`, ingredient)
    .pipe(take(1))
    .subscribe({
      next: () => {
        this.ui.openSnackBar(`Ingredient '${ingredient.name}' updated`);
        this.getAllIngredients();
      },
      error: err => {
        console.log(err);
        this.ui.onError('Error updating ingredient');
      }
    })
  }

  public updateRecipe(recipe: Recipe): void {
    console.log('RECIPE: ',recipe)
    this.http.put<Recipe>(`${this.url}/${recipe.id}`, recipe)
    .pipe(take(1))
    .subscribe({
      next: () => {
        this.recipeSubject.next(recipe);
        this.ui.openSnackBar(`Recipe '${recipe.name}' updated`);
        this.getRecipes();
      },
      error: err => {
        console.log(err);
        this.ui.onError('Error updating recipe');
      }
    })
  }

  // DELETE
  public deleteRecipeById(recipe:Recipe): void{
    this.http.delete<Recipe>(`${this.url}/${recipe.id}`)
    .pipe(take(1))
    .subscribe({
      next: () => {
        this.getRecipes();
        this.ui.openSnackBar(`Recipe '${recipe.name}' deleted`);
      },
      error: err => {
        console.log(err);
        this.ui.onError('Error deleting recipe');
      }
    })
  }

  public deleteIngredientById(ingredientId: number): void {
    this.http.delete<Ingredient>(`${this.ingredientsURL}/${ingredientId}`)
    .pipe(take(1))
    .subscribe({
      next: () => {
        this.getAllIngredients();
        this.ui.openSnackBar(`Ingredient deleted`);
      },
      error: err => {
        console.log(err);
        this.ui.onError('Error deleting ingredient');
      }
    })
  }


  // Liquid Volume Conversion
  public convert(value: number, fromUnit: string, toUnit: string): number {
    let result: number;
    //VOLUME
    switch (fromUnit) {
        case "liters":
            switch (toUnit) {
                case "liters":
                    result = value;
                    break;
                case "milliliters":
                    result = value * 1000;
                    break;
                case "gallons":
                    result = value * 0.264172;
                    break;
                case "fluid ounces":
                    result = value * 33.814;
                    break;
                default:
                    throw new Error(`Unsupported unit: ${toUnit}`);
            }
            break;
        case "milliliters":
            switch (toUnit) {
                case "liters":
                    result = value / 1000;
                    break;
                case "milliliters":
                    result = value;
                    break;
                case "gallons":
                    result = value * 0.000264172;
                    break;
                case "fluid ounces":
                    result = value * 0.033814;
                    break;
                default:
                    throw new Error(`Unsupported unit: ${toUnit}`);
            }
            break;
        case "gallons":
            switch (toUnit) {
                case "liters":
                    result = value / 0.264172;
                    break;
                case "milliliters":
                    result = value / 0.000264172;
                    break;
                case "gallons":
                    result = value;
                    break;
                case "fluid ounces":
                    result = value * 128;
                    break;
                default:
                    throw new Error(`Unsupported unit: ${toUnit}`);
            }
            break;
        case "fluid ounces":
            switch (toUnit) {
                case "liters":
                    result = value / 33.814;
                    break;
                case "milliliters":
                    result = value / 0.033814;
                    break;
                case "gallons":
                    result = value / 128;
                    break;
                case "fluid ounces":
                    result = value;
                    break;
                default:
                    throw new Error(`Unsupported unit: ${toUnit}`);
            }
            break;
            //Mass
        case "grams":
          switch (toUnit) {
              case "grams":
                  result = value;
                  break;
              case "kilograms":
                  result = value / 1000;
                  break;
              case "pounds":
                  result = value * 0.00220462;
                  break;
              case "ounces":
                  result = value * 0.035274;
                  break;
              default:
                  throw new Error(`Unsupported unit: ${toUnit}`);
          }
          break;
        case "kilograms":
            switch (toUnit) {
                case "grams":
                    result = value * 1000;
                    break;
                case "kilograms":
                    result = value;
                    break;
                case "pounds":
                    result = value * 2.20462;
                    break;
                case "ounces":
                    result = value * 35.274;
                    break;
                default:
                    throw new Error(`Unsupported unit: ${toUnit}`);
            }
            break;
        case "pounds":
            switch (toUnit) {
                case "grams":
                    result = value / 0.00220462;
                    break;
                case "kilograms":
                    result = value / 2.20462;
                    break;
                case "pounds":
                    result = value;
                    break;
                case "ounces":
                    result = value * 16;
                    break;
                default:
                    throw new Error(`Unsupported unit: ${toUnit}`);
            }
            break;
        case "ounces":
            switch (toUnit) {
                case "grams":
                    result = value / 0.035274;
                    break;
                case "kilograms":
                    result = value / 35.274;
                    break;
                case "pounds":
                    result = value / 16;
                    break;
                case "ounces":
                    result = value;
                    break;
                default:
                    throw new Error(`Unsupported unit: ${toUnit}`);
            }
            break;
        default:
            throw new Error(`Unsupported unit: ${fromUnit}`);
    }
    return result;
  }

  


}