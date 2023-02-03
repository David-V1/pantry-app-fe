import { Component, OnDestroy } from '@angular/core';
import { UiService } from 'src/app/services/ui.service';
import { PageName } from 'src/app/enums/PageEnum';
import { RecipeService } from 'src/app/services/recipe.service';
import { RecipeDTO } from 'src/app/models/modelsDTO/RecipeDTO';
import { AccountService } from 'src/app/services/account.service';
import {  map, Subscription } from 'rxjs';

@Component({
  selector: 'app-recipe',
  templateUrl: './recipe.component.html',
  styleUrls: ['./recipe.component.css']
})
export class RecipeComponent implements OnDestroy{
    public pageName = PageName;
    public recipes: RecipeDTO[] = [];
    recipeSubscription: Subscription;
   
    constructor(public ui: UiService, public recipeService: RecipeService, public accountService: AccountService) { 
      this.recipeService.getRecipesDTO();
      
      this.recipeSubscription= this.recipeService.recipesDTO$

        // only get User Recipes for display
        .pipe(
          map(recipe => recipe.filter((recipeId: RecipeDTO) => recipeId.account.id! === this.ui.currentUserId)))
        .subscribe({
          next: recipesDTO => {
            this.recipes = recipesDTO;
          },
          error: err => {
            console.log(err);
            this.ui.onError('Error getting recipes');
          }});
          this.recipeService.getRecipesDTO();
        
    }
  
    public onSelectRecipe(id: number) {
      this.recipeService.getRecipeById(id);
      this.ui.changePage(this.pageName.RECIPE_VIEW)
      location.reload();
    }
    
    ngOnDestroy(): void {
      this.recipeSubscription.unsubscribe();
    }
}
