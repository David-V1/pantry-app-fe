import { Component, OnDestroy } from '@angular/core';
import { UiService } from 'src/app/services/ui.service';
import { PageName } from 'src/app/enums/PageEnum';
import { RecipeService } from 'src/app/services/recipe.service';
import { Recipe } from 'src/app/models/Recipe';
import { map, pipe, Subscription, take, tap } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnDestroy {
  public pageName = PageName;
  public heroRecipes: Recipe[] =[]
  recipeSubscription: Subscription

  constructor(public ui: UiService, public recipeService: RecipeService) {
    this.recipeSubscription = this.recipeService.recipes$
    .pipe(map(recipes =>recipes.filter(obj => obj.id! <= 3))) // 3 hero Images TODO: need to be random or Favs
    .subscribe({
      next: recipes => this.heroRecipes = recipes,
      error: err => console.log(err)
    })
    this.recipeService.getRecipes();
   }
   

  public onViewRecipes(): void {
    // location.reload();
    this.ui.changePage(PageName.RECIPE);
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
