import { Component, OnInit } from '@angular/core';
import { UiService } from 'src/app/services/ui.service';
import { PageName } from 'src/app/enums/PageEnum';
import { RecipeService } from 'src/app/services/recipe.service';
import { Recipe } from 'src/app/models/Recipe';
import { ItemService } from 'src/app/services/item.service';
import { Item } from 'src/app/models/Item';
import { Ingredient } from 'src/app/models/Ingredient';
import { IngredientDTO } from 'src/app/models/modelsDTO/IngredientDTO';
import { combineLatest, distinct, filter, map, Observable, of, retry, take, tap } from 'rxjs';

@Component({
  selector: 'app-recipe-view',
  templateUrl: './recipe-view.component.html',
  styleUrls: ['./recipe-view.component.css']
})
export class RecipeViewComponent implements OnInit {
  public pageName = PageName;
  public currentRecipeId = Number(localStorage.getItem('selectedRecipeId'));
  public itemsToDelete: Item[] = [];
  public itemsToUpdate = new Set<Item[] | Item>();// Item - for adding elements to  Set
  public itemssToDelete = new Set<Item>();

  // Updating Pantry Items
  public currentSelectedIngredients: IngredientDTO[] = [];
  public currentPantryMatchingItems: Item[] = [];
  public pantryItemsReadyForUpdate = new Array();
  
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
  public metricUnits = this.recipeService.recipeVolumeOptions;
  public edit = false;
  public currentIngredientId: number | null = null;
  public ingredientBeenUpdated = false; // state to keep track of duplicates for 'Cook Recipe!' button
  public ingredientBeenDeleted = false; // state to keep track of duplicates for 'Cook Recipe!' button

  
  
  constructor(public ui: UiService, public recipeService: RecipeService, public itemService: ItemService) { 
    this.recipeService.getRecipeById(Number(localStorage.getItem('selectedRecipeId')));
    this.recipeService.getAllIngredients();
    this.itemService.getAllItems();
    this.bindPantryItemsAndRecipeIngredients();
    this.selectedRecipeIngredients$.subscribe(ingredients => {
      this.currentSelectedIngredients = ingredients;
    })
  }
  ngOnInit(): void {
    setTimeout(() => {
      this.partitionPantryItemForHttpOutcome()
    }, 500);
  }
 
    // Depending on the recipe, get the ingredients that match the recipe id
    public selectedRecipeIngredients$ = combineLatest([this.recipeService.ingredients$, this.recipeService.recipe$])
    .pipe(map(([ingredients, recipes]) => 
      ingredients.filter((ingredient) => ingredient.recipes.id === recipes.id)
    ),retry(1)) // retry() when updating Recipe.


  // NEW ITERATION TEST from the ABOVE CODE
  matchingPantryItems$ = combineLatest([this.itemService.items$, this.selectedRecipeIngredients$])
  .pipe(
    map(([items, ingredients]) => {
      let ingredientNames = ingredients.map(y => {
        if (y.name.slice(-1) === 's') return y.name.slice(0, -1).toLocaleLowerCase()
        return y.name.toLocaleLowerCase()
      });
      let matchingItems = items.filter(item => {
        if (item.name.slice(-1) === 's') {
          let itemName = item.name.slice(0, -1).toLocaleLowerCase()
          return ingredientNames.includes(itemName)
        }
        return ingredientNames.includes(item.name.toLocaleLowerCase())
      });
      return matchingItems;
    })
    ).subscribe(matchingPantry => {
      this.currentPantryMatchingItems = matchingPantry;
      // console.log('MATCHING PANTRY ITEMS',matchingPantry)

    })
 
  public bindPantryItemsAndRecipeIngredients(){
    combineLatest([this.itemService.items$, this.selectedRecipeIngredients$]).pipe(
      map(([items, ingredients]) => {
        let ingredientNames = ingredients.map(y => {
          if (y.name.slice(-1) === 's') return y.name.slice(0, -1).toLocaleLowerCase()
          return y.name.toLocaleLowerCase()
        });
        let matchingItems = items.filter(item => {
          if (item.name.slice(-1) === 's') {
            let itemName = item.name.slice(0, -1).toLocaleLowerCase()
            return ingredientNames.includes(itemName)
          }
          return ingredientNames.includes(item.name.toLocaleLowerCase())
        });
        return matchingItems;
      })
    ).subscribe({
      next: (items) => {
        // console.log('LINE 103',items)
        this.itemsToDelete = items;

      },
      error: (err) => console.log(err),
    })
  }
  
  public showEditIngredient(ingredientid:number): void {
    console.log('INGREDIENT ID', ingredientid)
    this.currentIngredientId = ingredientid;
    this.edit = !this.edit;
  }

  toggleEditRecipeIcons(): void{
    this.showEditIcon = !this.showEditIcon;
  }

  public onUpdateIngredients(): void {
    //Check null
    if(this.updatedIngredient.name === "") return this.ui.onError("Name cannot be empty");
    // If quantity then no weight
    if (this.updatedIngredient.quantity >= 1){
      this.updatedIngredient.metric = "";
      this.updatedIngredient.weight = 0;
    } 
    if (this.updatedIngredient.weight && this.updatedIngredient.metric) this.updatedIngredient.quantity = 0;

    if (this.updatedIngredient.weight === 0 && this.updatedIngredient.quantity === 0) return this.ui.onError("Please assign quantity or weight");
    this.edit = !this.edit;  
    this.recipeService.updateIngredient(this.currentIngredientId!,this.updatedIngredient);
    //ingredient update checker
    this.ingredientBeenUpdated = true;
    this.updatedIngredient = {} as Ingredient;
  }
  public onDeleteIngredientById(ingredientId: number): void {
    if (ingredientId === null) return this.ui.onError("Ingredient ID cannot be null");
    this.recipeService.deleteIngredientById(ingredientId);
    this.ingredientBeenUpdated = true;
  }

  public onCookRecipe(): void {
    //this.partitionPantryItemForHttpOutcome(); Moved to onInit
    if (this.itemssToDelete.size) {
      this.itemService.deletePantryItemsOnCook(this.itemssToDelete);
      
    };
    if (this.pantryItemsReadyForUpdate){
      this.itemService.updateItemQuantitiesOnCook(this.pantryItemsReadyForUpdate);
    };
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

  //Creating Recipe instruction steps 1.) 2.) 3.) etc
  public instructionParagraphs(instructions: string): string[] {
    let steps: string[] = [];
    this.paragraphs = instructions.split(/[\r\n]+/); // split on new lines
    this.paragraphs.forEach((paragraph, index) => {
      steps.push(`Step ${index + 1}.) ${paragraph}`)
    })
    return steps;
  }
  
  // UPDATE PANTRY ITEMS ON COOK
  public partitionPantryItemForHttpOutcome(): void {
    this.currentPantryMatchingItems.forEach((matchingItem) => {
      this.currentSelectedIngredients.forEach((ingredient) => {
        // Edge case for plural items
        let noSItem;
        let noSIngredient;
        if (matchingItem.name.endsWith('s')){
          noSItem = matchingItem.name.slice(0,-1).toLocaleLowerCase();
        }
        if (ingredient.name.endsWith('s')){
          noSIngredient = ingredient.name.slice(0,-1).toLocaleLowerCase();
        }
        if (matchingItem.name.toLocaleLowerCase() === ingredient.name.toLocaleLowerCase() || noSItem === ingredient.name.toLocaleLowerCase() || matchingItem.name.toLocaleLowerCase() === noSIngredient){
          if (matchingItem.quantity < ingredient.quantity) this.itemssToDelete.add(matchingItem)

          if (matchingItem.quantity > ingredient.quantity) {
            this.itemsToUpdate.add(matchingItem)
            let updatedItem = {
              ...matchingItem,
              quantity: matchingItem.quantity - ingredient.quantity
            }
            this.pantryItemsReadyForUpdate.push(updatedItem)
          };
          console.log('matchingItem: ', matchingItem, 'ingredient: ', ingredient)
          console.log('matchingItem.quantity: ', matchingItem.quantity, 'ingredient.quantity: ', ingredient.quantity)
          if (matchingItem.quantity === ingredient.quantity && matchingItem.quantity !== 0 && ingredient.quantity !== 0) this.itemssToDelete.add(matchingItem)

          //Checking for items that have weight
          if (matchingItem.weight && ingredient.weight){
            // console.log('matchingItem: ', matchingItem)
            // console.log('OG Weight',matchingItem.weight, 'OG Metric',matchingItem.metric)
            // console.log('Ingredient Weight',ingredient.weight,'Ingredient Metric',ingredient.metric)
            // console.log('')
            
            let itemCovertedWeight = this.recipeService.convert(matchingItem.weight, matchingItem.metric, ingredient.metric)
            // console.log('Pantry item weight:',matchingItem.weight,' From this Metric:',matchingItem.metric, 'To this Metric:',ingredient.metric)
            // console.log('Converted Weight',itemCovertedWeight)
            if (itemCovertedWeight < ingredient.weight) this.itemssToDelete.add(matchingItem)

            if (itemCovertedWeight > ingredient.weight) {
              let ingredientWeightConversion = this.recipeService.convert(ingredient.weight, ingredient.metric, matchingItem.metric)
              this.itemsToUpdate.add(matchingItem)
              let updatedItem = {
                ...matchingItem,
                weight: (matchingItem.weight - ingredientWeightConversion).toFixed(2)
              }
              this.pantryItemsReadyForUpdate.push(updatedItem)
            };
            
            if (itemCovertedWeight === ingredient.weight) this.itemssToDelete.add(matchingItem)
          }
        }
        return this.pantryItemsReadyForUpdate;
      })
    })
    console.log('Items to delete: ', this.itemssToDelete)
    console.log('Items to update w/ original QTY: ', this.itemsToUpdate)
    console.log('Items to update: ', this.pantryItemsReadyForUpdate)
  }

}
