import { Component } from '@angular/core';
import { UiService } from 'src/app/services/ui.service';
import { PageName } from 'src/app/enums/PageEnum';
import { RecipeService } from 'src/app/services/recipe.service';
import { Ingredient } from 'src/app/models/Ingredient';
import { Recipe } from 'src/app/models/Recipe';

@Component({
  selector: 'app-ingredient-add',
  templateUrl: './ingredient-add.component.html',
  styleUrls: ['./ingredient-add.component.css']
})
export class IngredientAddComponent {
  public pageName = PageName;
  slider = false;
  public metricUnits = this.recipeService.recipeVolumeOptions;
  public addedIngredients: Ingredient[] = []
  public recipeId: number;
  selectedRecipe: Recipe = {} as Recipe;

  
  public newIngredient: Ingredient = {
    id: null,
    name: '',
    weight: 0,
    quantity: 0,
    metric: ''
  }

  constructor(public ui: UiService, public recipeService: RecipeService) { 
    this.recipeId = Number(localStorage.getItem('selectedRecipeId'));
    this.recipeService.getRecipeForIngredients(this.recipeId)
    .pipe().subscribe((recipe: Recipe) => {
      this.selectedRecipe = recipe;
    });
  }

  addIngredient() {
    this.addedIngredients.push(this.newIngredient);
    if (Number(localStorage.getItem('selectedRecipeId')) === null){
      this.ui.onError('Recipe not selected')
      return;
    };
    console.log( this.recipeId,this.newIngredient)
    this.recipeService.addIngredientsToRecipe(this.recipeId, this.newIngredient);
    this.resetIngredient();
  }

  public goBackClick(): void {
    this.ui.changePage(this.pageName.RECIPE);
    localStorage.removeItem('selectedRecipeId');
  }

  resetIngredient() {
    this.newIngredient = {
      id: null,
      name: '',
      weight: 0,
      quantity: 0,
      metric: ''
    }
    this.slider = false;
  }

}
