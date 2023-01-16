import { Component } from '@angular/core';
import { UiService } from 'src/app/services/ui.service';
import { PageName } from 'src/app/enums/PageEnum';
import { RecipeService } from 'src/app/services/recipe.service';
import { Recipe } from 'src/app/models/Recipe';

@Component({
  selector: 'app-recipe-view',
  templateUrl: './recipe-view.component.html',
  styleUrls: ['./recipe-view.component.css']
})
export class RecipeViewComponent {
  public pageName = PageName;
  currentRecipeId = Number(localStorage.getItem('selectedRecipeId'));
  
  constructor(public ui: UiService, public recipeService: RecipeService) {
    this.recipeService.getRecipeById(Number(localStorage.getItem('selectedRecipeId')));
    
    this.recipeService.getAllIngredients();

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
  

}
