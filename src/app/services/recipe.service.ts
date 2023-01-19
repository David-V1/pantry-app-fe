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
  // selectedRecipe: number | null = null;
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

  public updateRecipe(id: number, recipe: Recipe): void {
    this.http.put<Recipe>(`${this.url}/${id}`, recipe)
    .pipe(take(1))
    .subscribe({
      next: () => {
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
        this.ui.openSnackBar(`Recipe '${recipe.name}' deleted`);
        this.getRecipes();
      },
      error: err => {
        console.log(err);
        this.ui.onError('Error deleting recipe');
      }
    })
  }


















}
