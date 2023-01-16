import { Component } from '@angular/core';
import { UiService } from 'src/app/services/ui.service';
import { PageName } from 'src/app/enums/PageEnum';
import { RecipeService } from 'src/app/services/recipe.service';
import { Ingredient } from 'src/app/models/Ingredient';
import { BehaviorSubject, of, Subject } from 'rxjs';

@Component({
  selector: 'app-ingredient-add',
  templateUrl: './ingredient-add.component.html',
  styleUrls: ['./ingredient-add.component.css']
})
export class IngredientAddComponent {
  public pageName = PageName;
  slider = false;
  public metricUnits = ['grams', 'kilograms']; //['g', 'kg', 'ml', 'l', 'tsp', 'tbsp', 'cup', 'oz', 'lb', 'pt', 'qt', 'gal'];
  public addedIngredients: Ingredient[] = []

  
  public newIngredient: Ingredient = {
    id: null,
    name: '',
    weight: 0,
    quantity: 0,
    metric: ''
  }

  constructor(public ui: UiService, public recipeService: RecipeService) { }

  addIngredient() {
    this.addedIngredients.push(this.newIngredient);
    // if (this.recipeService.selectedRecipe === null){
    if (Number(localStorage.getItem('selectedRecipeId')) === null){
      this.ui.onError('Recipe not selected')
      return;
    };

    // this.recipeService.addIngredientsToRecipe(this.recipeService.selectedRecipe!, this.newIngredient);
    this.recipeService.addIngredientsToRecipe(Number(localStorage.getItem('selectedRecipeId')), this.newIngredient);
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
