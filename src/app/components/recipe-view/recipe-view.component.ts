import { Component } from '@angular/core';
import { UiService } from 'src/app/services/ui.service';
import { PageName } from 'src/app/enums/PageEnum';
import { RecipeService } from 'src/app/services/recipe.service';
import { Recipe } from 'src/app/models/Recipe';
import { ItemService } from 'src/app/services/item.service';
import { Item } from 'src/app/models/Item';
import { Ingredient } from 'src/app/models/Ingredient';
import { IngredientDTO } from 'src/app/models/modelsDTO/IngredientDTO';
import { combineLatest, filter, map, Observable, of, retry, take, tap } from 'rxjs';

@Component({
  selector: 'app-recipe-view',
  templateUrl: './recipe-view.component.html',
  styleUrls: ['./recipe-view.component.css']
})
export class RecipeViewComponent {
  public pageName = PageName;
  public currentRecipeId = Number(localStorage.getItem('selectedRecipeId'));
  public itemsToDelete: Item[] = [];
  
  // Recipe Update
  public updatedRecipe = {} as Recipe;
  public showEditIcon = false;
  public recipeNewValue: string = '';

  //Text Area
  public textAreaInput: string = this.recipeNewValue;
  public paragraphs: Array<string> = [];

  //Toggle Input boxes
  public showEditRecipeName = false;
  public showEditRecipeImage = false;
  public showEditRecipeInstructions = false;

  //Ingredient Update
  public updatedIngredient = {} as Ingredient;
  public slider = false;
  public metricUnits = ['g', 'kg', 'ml', 'l', 'tsp', 'tbsp', 'cup', 'oz', 'lb', 'pt', 'qt', 'gal']; 
  public edit = false;
  public currentIngredientId: number | null = null;

  
  
  constructor(public ui: UiService, public recipeService: RecipeService, public itemService: ItemService) { 
    this.recipeService.getRecipeById(Number(localStorage.getItem('selectedRecipeId')));
    this.recipeService.getAllIngredients();
    this.itemService.getAllItems();
    this.bindPantryItemsAndRecipeIngredients();
  }

  //********************
  // Get the items to process and update quantites or weight.
  public matchingPantryItems$ = combineLatest([
    this.recipeService.ingredients$, 
    this.itemService.items$, 
    this.recipeService.recipe$])
  .pipe(
    map(([ingredients, items, recipes]) =>
      // ingredients.filter((ingredient) => ingredient.recipes.id === recipes.id && items.map(item => item.name.toLocaleLowerCase() === ingredient.name.toLocaleLowerCase())) //<- links ingredients to recipe
      ingredients.filter((ingredient) => ingredient.recipes.id === recipes.id), //<- links ingredients to recipe
    ))
    // .subscribe(x => console.log(x))

    

//***************
  // Depending on the recipe, get the ingredients that match the recipe id
  public selectedRecipeIngredients$ = combineLatest([this.recipeService.ingredients$, this.recipeService.recipe$])
  .pipe(map(([ingredients, recipes]) => 
    ingredients.filter((ingredient) => ingredient.recipes.id === recipes.id)
  ),retry(1)) // for when updating Recipe.

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
  
  public showEditIngredient(ingredientid:number): void {
    this.currentIngredientId = ingredientid;
    this.edit = !this.edit;
  }

  toggleEditRecipeIcons(): void{
    this.showEditIcon = !this.showEditIcon;
  }

  public onUpdateIngredients(): void {
    this.edit = !this.edit;  
    this.recipeService.updateIngredient(this.currentIngredientId!,this.updatedIngredient);
  }

  public onCookRecipe(): void {
    this.itemService.deletePantryItemsOnCook(this.itemsToDelete);
    this.ui.changePage(this.pageName.RECIPE);    
  }

  public hideEdit(): void {
    this.edit = !this.edit;
  }

  public deleteRecipe(recipe: Recipe): void {
    this.recipeService.deleteRecipeById(recipe)
    localStorage.removeItem('selectedRecipeId');
    this.ui.changePage(this.pageName.RECIPE);
  }

  public goBackClick(): void {
    this.ui.changePage(this.pageName.RECIPE);
    localStorage.removeItem('selectedRecipeId');
  }

  // PUT
  public onEditRecipeName(recipe: Recipe): void {
    if (this.recipeNewValue === '') return this.ui.onError('Name cannot be empty');
    const newRecipeName: Recipe = {
      id: recipe.id,
      name: this.recipeNewValue,
      image: recipe.image,
      instructions: recipe.instructions,
    }
    this.recipeService.updateRecipe(newRecipeName);
    this.toggleRecipeName();
    this.toggleEditRecipeIcons();
    this.recipeNewValue = '';
  }

  public onEditRecipeImage(recipe: Recipe): void {
    if (this.recipeNewValue === '') return this.ui.onError('Image cannot be empty');
    const newRecipeImage: Recipe = {
      id: recipe.id,
      name: recipe.name,
      image: this.recipeNewValue,
      instructions: recipe.instructions,
    }
    this.recipeService.updateRecipe(newRecipeImage);
    this.toggleRecipeImage();
    this.toggleEditRecipeIcons();
    this.recipeNewValue = '';
  }

  public onEditRecipeInstructions(recipe: Recipe): void {
    if (this.recipeNewValue === '') return this.ui.onError('Instructions cannot be empty');
    const newRecipeInstructions: Recipe = {
      id: recipe.id,
      name: recipe.name,
      image: recipe.image,
      instructions: this.recipeNewValue,
    }
    this.recipeService.updateRecipe(newRecipeInstructions);
    this.toggleRecipeInstructions();
    this.toggleEditRecipeIcons();
    this.recipeNewValue = '';
  }

  public toggleRecipeName(): void {
    this.showEditRecipeName = !this.showEditRecipeName;
  }

  public toggleRecipeImage(): void {
    this.showEditRecipeImage = !this.showEditRecipeImage;
  }

  public toggleRecipeInstructions(): void {
    this.showEditRecipeInstructions = !this.showEditRecipeInstructions;
  }

  public instructionParagraphs(instructions: string): string[] {
    let steps: string[] = [];
    this.paragraphs = instructions.split(/[\r\n]+/); // split on new lines
    this.paragraphs.forEach((paragraph, index) => {
      steps.push(`Step ${index + 1}.)    ${paragraph}`)
    })
    return steps;
  }
  
}
