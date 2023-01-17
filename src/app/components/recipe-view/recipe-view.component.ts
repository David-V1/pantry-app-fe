import { Component } from '@angular/core';
import { UiService } from 'src/app/services/ui.service';
import { PageName } from 'src/app/enums/PageEnum';
import { RecipeService } from 'src/app/services/recipe.service';
import { Recipe } from 'src/app/models/Recipe';
import { ItemService } from 'src/app/services/item.service';
import { Item } from 'src/app/models/Item';
import { Ingredient } from 'src/app/models/Ingredient';
import { IngredientDTO } from 'src/app/models/modelsDTO/IngredientDTO';
import { combineLatest, filter, map, Observable, of, take, tap } from 'rxjs';

@Component({
  selector: 'app-recipe-view',
  templateUrl: './recipe-view.component.html',
  styleUrls: ['./recipe-view.component.css']
})
export class RecipeViewComponent {
  public pageName = PageName;
  currentRecipeId = Number(localStorage.getItem('selectedRecipeId'));
  itemsToDelete: Item[] = [];

  // Recipe Update
  updatedRecipe = {} as Recipe;
  showUpdateRecipe = false;

  //Ingredient Update
  updatedIngredient = {} as Ingredient;
  slider = false;
  metricUnits = ['grams', 'kilograms']; 
  edit = false;
  currentIngredientId: number | null = null;

  
  
  constructor(public ui: UiService, public recipeService: RecipeService, public itemService: ItemService) { 
    this.recipeService.getRecipeById(Number(localStorage.getItem('selectedRecipeId')));
    this.recipeService.getAllIngredients();
    this.itemService.getAllItems();
    this.bindPantryItemsAndRecipeIngredients();
    
  }

  public deleteRecipe(recipe: Recipe): void {
    this.recipeService.deleteRecipeById(recipe)
    this.ui.changePage(this.pageName.RECIPE);
    localStorage.removeItem('selectedRecipeId');
  }

  public goBackClick(): void {
    this.ui.changePage(this.pageName.RECIPE);
    localStorage.removeItem('selectedRecipeId');
  }
  // Depending on the recipe, get the ingredients that match the recipe id
  public selectedRecipeIngredients$ = combineLatest([this.recipeService.ingredients$, this.recipeService.recipe$])
  .pipe(map(([ingredients, recipes]) => 
    ingredients.filter((ingredient) => ingredient.recipes.id === recipes.id)
  ))

  public bindPantryItemsAndRecipeIngredients(){
    combineLatest([this.itemService.items$, this.selectedRecipeIngredients$]).pipe(
      map(([items, ingredients]) => {
        let ingredientNames = ingredients.map(y => y.name.toLocaleLowerCase());
        let matchingItems = items.filter(x => ingredientNames.includes(x.name.toLocaleLowerCase()));
        return matchingItems;
      })
    ).subscribe({
      next: (value) => {
        this.itemsToDelete = value;

      },
      error: (err) => console.log(err),
    })
  }
  
  public showEdit(ingredientid:number): void {
    this.currentIngredientId = ingredientid;
    this.edit = !this.edit;
  }

  showEditRecipe(): void{
    this.showUpdateRecipe = !this.showUpdateRecipe;
  }
  
  public onUpdateRecipe(recipeId: number): void {
    this.recipeService.updateRecipe(recipeId, this.updatedRecipe);
    this.showUpdateRecipe = !this.showUpdateRecipe;
  }

  public onUpdateIngredients(): void {
    this.edit = !this.edit;  
    this.recipeService.updateIngredient(this.currentIngredientId!,this.updatedIngredient);

  }

  public onCookRecipe(): void {
    this.itemService.deletePantryItemsOnCook(this.itemsToDelete);
    this.ui.changePage(this.pageName.RECIPE);    
  }



}
