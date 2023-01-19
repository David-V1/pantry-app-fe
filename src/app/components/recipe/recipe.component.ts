import { Component, OnDestroy } from '@angular/core';
import { UiService } from 'src/app/services/ui.service';
import { PageName } from 'src/app/enums/PageEnum';
import { RecipeService } from 'src/app/services/recipe.service';
import { Recipe } from 'src/app/models/Recipe';
import { RecipeDTO } from 'src/app/models/modelsDTO/RecipeDTO';
import { AccountService } from 'src/app/services/account.service';
import { map, Subscription } from 'rxjs';

@Component({
  selector: 'app-recipe',
  templateUrl: './recipe.component.html',
  styleUrls: ['./recipe.component.css']
})
export class RecipeComponent implements OnDestroy{
    public pageName = PageName;
    public recipes: Recipe[] | RecipeDTO[] = [];
    recipeSubscription: Subscription;
   
    constructor(public ui: UiService, public recipeService: RecipeService, public accountService: AccountService) { 
      
      this.recipeSubscription= this.recipeService.recipesDTO$
        // .pipe(map(recipe => recipe.map(r => r.account.id === this.recipeService.userId)))
        .pipe(map(recipe => recipe.filter(r => r.account.id === this.recipeService.userId)))
        .subscribe({
          next: recipesDTO => {
            this.recipes = recipesDTO;
            // console.log(this.recipes)
          }})
        this.recipeService.getRecipesDTO();
    }
  
    public onSelectRecipe(id: number) {
      // this.recipeService.selectedRecipe = id;
      this.recipeService.getRecipeById(id);
      this.ui.changePage(this.pageName.RECIPE_VIEW)
    }
    
    ngOnDestroy(): void {
      this.recipeSubscription.unsubscribe();
    }
}
