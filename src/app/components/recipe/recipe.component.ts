import { Component } from '@angular/core';
import { UiService } from 'src/app/services/ui.service';
import { PageName } from 'src/app/enums/PageEnum';
import { RecipeService } from 'src/app/services/recipe.service';
import { Recipe } from 'src/app/models/Recipe';

@Component({
  selector: 'app-recipe',
  templateUrl: './recipe.component.html',
  styleUrls: ['./recipe.component.css']
})
export class RecipeComponent {
    public pageName = PageName;
    public recipes: Recipe[] = [];
   
    constructor(public ui: UiService, public recipeService: RecipeService) { 
      this.recipeService.recipes$.subscribe({
        next: recipes => {
          this.recipes = recipes;
        }})
        this.recipeService.getRecipes();
    }
  
    public onSelectRecipe(id: number) {
      this.recipeService.selectedRecipe = id;
      this.recipeService.getRecipeById(id);
      this.ui.changePage(this.pageName.RECIPE_VIEW)
    }
   
}
