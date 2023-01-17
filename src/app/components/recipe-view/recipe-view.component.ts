import { Component, OnDestroy, OnInit } from '@angular/core';
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
export class RecipeViewComponent implements OnInit, OnDestroy{
  public pageName = PageName;
  currentRecipeId = Number(localStorage.getItem('selectedRecipeId'));
  itemsToDelete: Item[] = [];
  allIngredients: IngredientDTO[] = [];
  allRecipes: Recipe[] = [];
  selectedRecipeIngredients: IngredientDTO[] = [];
  matchingIngredientsWithItems: string[] = [];

  arrayOfMatchingIngredientIds: number[] = [];

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

    // this.itemService.items$.subscribe(items => this.currentItems = items);
    // this.recipeService.ingredients$.subscribe(ingredients => this.allIngredients = ingredients);
    // this.recipeService.recipes$.subscribe(recipes => this.allRecipes = recipes);
    // this.selectedRecipeIngredients$.subscribe(ingredients => this.selectedRecipeIngredients = ingredients);
    // console.log('constructor(): ',this.itemsToDelete)
    this.itemService.getAllItems();
    this.funFunFunction();
    
  }

  ngOnInit(): void {
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

  // clicker(){
  //   let itemName$ = this.itemService.items$.pipe(map(items => items.map(item => item.name)))
  //   let selectedIngredients$ = this.selectedRecipeIngredients$.pipe(map(ingredients => ingredients.map(ingredient => ingredient.name)))
  //   itemName$.pipe(tap(i => console.log(i))).subscribe(item => console.log(item))
  // }
  
  public funFunFunction(){

    console.log('fun fun function')
    combineLatest([this.itemService.items$, this.selectedRecipeIngredients$]).pipe(
      map(([items, ingredients]) => {
        let ingredientNames = ingredients.map(y => y.name.toLocaleLowerCase());
        let matchingItems = items.filter(x => ingredientNames.includes(x.name.toLocaleLowerCase()));
        return matchingItems;
      })
    ).subscribe({
      next: (value) => {
        console.log('next =>',value)
        this.itemsToDelete = value;
        // this.itemsToDelete = value;
        // console.log('Inside of Subscribe() this.itemsToDelete: ',this.itemsToDelete)
      },
      error: (err) => console.log(err),
    })
  }
  
  // matchingPantryItems$ = combineLatest([this.itemService.items$, this.selectedRecipeIngredients$]).subscribe(([items, ingredients]) => {
  //   // let itemNames = items.map(x => x.name.toLocaleLowerCase());
  //   let ingredientNames = ingredients.map(y => y.name.toLocaleLowerCase());
  //   // let matchingIngredientss = itemNames.filter(x => ingredientNames.includes(x));
  //   // console.log(matchingIngredients);
  // // let matchingIngredients = ingredients.filter(x => itemNames.includes(x.name.toLocaleLowerCase()));
  // // console.log(matchingIngredients);
  //   // let matchingItems = items.filter(x => ingredientNames.includes(x.name.toLocaleLowerCase()));
  //   let matchingItems = items.filter(x => ingredientNames.includes(x.name.toLocaleLowerCase()));
  //   if(matchingItems.length !== undefined) {
  //     this.itemsToDelete = matchingItems;
  //   }

    
  //   console.log(matchingItems);
  //   // matchingItems.map(item => this.arrayOfMatchingIngredientIds.push(item.id!));
  //   // of(matchingItems).subscribe(items => items.map(item => this.arrayOfMatchingIngredientIds = item.id!)
  //   // matchingItems.forEach(item => {
  //   //   this.arrayOfMatchingIngredientIds.push(item.id!);
  //   // })
  //   // console.log(this.arrayOfMatchingIngredientIds)
  // })
  

  test(): void {
    
    
    // console.log('test', this.funFunFunction())
    // if (this.itemsToDelete.length === 0) {
    //   location.reload();
    // }
    console.log('Items array inside test()',this.itemsToDelete)
    
    // console.log('test')
    // console.log(this.arrayOfMatchingIngredientIds)
    // const matchingIngredients: string[] = []
    // let arrayOfIngredientNames = this.selectedRecipeIngredients.map(ingredient => ingredient.name)
    // console.log('all ITEMS',this.currentItems)
    // console.log('all INGREDIENTS',this.allIngredients.map(ingredient => ingredient.name)) // data
    // console.log('all RECIPES',this.allRecipes) // selected recipe
    // console.log('SELECTED INGREDIENTS',this.selectedRecipeIngredients) 
    // console.log('MATCHING INGREDIENTS',this.matchingIngredientsWithItems)
    
    

    // this.currentItems.forEach(item => {
    //   // console.log('item name', item.name)
    //   this.selectedRecipeIngredients.forEach(ingredientName => {
    //     if (item.name.toLocaleLowerCase() === ingredientName.name.toLocaleLowerCase()) {
    //       matchingIngredients.push(ingredientName.name)
    //       this.matchingIngredientsWithItems.push(ingredientName.name)
    //     }
    //   })
    // })
    // console.log(matchingIngredients)
    // console.log(this.matchingIngredientsWithItems)
    
  }

  public showEdit(ingredientid:number): void {
    this.currentIngredientId = ingredientid;
    this.edit = !this.edit;
  }

  showEditRecipe(): void{
    this.showUpdateRecipe = !this.showUpdateRecipe;
  }
  
  public onUpdateRecipe(recipeId: number): void {
    // this.recipeService.updateRecipe(recipe);
    console.log(this.updatedRecipe)
    this.recipeService.updateRecipe(recipeId, this.updatedRecipe);
    this.showUpdateRecipe = !this.showUpdateRecipe;
  }

  public onUpdateIngredients(): void {
    this.edit = !this.edit;
    console.log(this.currentIngredientId)
    console.log(this.updatedIngredient)
    
    this.recipeService.updateIngredient(this.currentIngredientId!,this.updatedIngredient);

  }


  public onCookRecipe(): void {
    this.itemService.deletePantryItemsOnCook(this.itemsToDelete);
    this.ui.changePage(this.pageName.RECIPE);    
  }

  
  ngOnDestroy(): void {
  }

 

}
