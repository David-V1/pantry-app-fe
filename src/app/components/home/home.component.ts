import { Component, OnDestroy } from '@angular/core';
import { UiService } from 'src/app/services/ui.service';
import { PageName } from 'src/app/enums/PageEnum';
import { RecipeService } from 'src/app/services/recipe.service';
import { Recipe } from 'src/app/models/Recipe';
import { distinct, distinctUntilChanged, filter, map, pipe, Subscription, take, tap } from 'rxjs';
import { AccountService } from 'src/app/services/account.service';
import { RecipeDTO } from 'src/app/models/modelsDTO/RecipeDTO';
import { ItemService } from 'src/app/services/item.service';
import { ItemDTO } from 'src/app/models/modelsDTO/ItemDTO';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnDestroy {
  public pageName = PageName;
  public heroRecipes: RecipeDTO[] =[]
  public currentUserItems: ItemDTO[] = [];
  private recipeSubscription: Subscription;
  private itemSubscription: Subscription;
  public activeIndex: number = 1;

  constructor(public ui: UiService, public recipeService: RecipeService, public accountService: AccountService, public itemService: ItemService) {
    this.recipeSubscription = this.recipeService.recipesDTO$
    .pipe(
      map(recipes => recipes.filter(recipe => recipe.account.familyName !== recipeService.currentFamilyName)),
      distinct(),
      map(recipes => recipes.slice(0, 3)) // Take the first 3
      ) 
    .subscribe({
      next: recipes => this.heroRecipes = recipes,
      error: err => console.log(err)
    });
    this.itemSubscription = this.itemService.itemsDTO$
    .pipe(
      map(items => items.filter(item => item.account.id === this.ui.currentUserId))
    )
    .subscribe(itemsDTO =>{ 
      this.currentUserItems = itemsDTO
    }); 
    this.recipeService.getRecipesDTO();
    this.itemService.getAllItemsDTO()
   }
   

  public onViewRecipes(): void {
    this.ui.changePage(PageName.RECIPE);
  }

  public onSelectRecipe(id: number) {
    this.recipeService.getRecipeById(id);
    this.ui.changePage(this.pageName.RECIPE_VIEW)
  }

  public onLogout(): void {
    this.ui.onLogout();
    this.ui.changePage(this.pageName.START_UP)
  }

  ngOnDestroy(): void {
    this.recipeSubscription.unsubscribe();
    this.itemSubscription.unsubscribe();
  }

  public makeActive(index: number): void {
    this.activeIndex = index;
  }
  

  test() {
    console.log('Icon Clicked');
  }

}
