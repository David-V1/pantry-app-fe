import { Component } from '@angular/core';
import { UiService } from 'src/app/services/ui.service';
import { PageName } from 'src/app/enums/PageEnum';
import { RecipeService } from 'src/app/services/recipe.service';
import { RecipeDTO } from 'src/app/models/modelsDTO/RecipeDTO';
import { Account } from 'src/app/models/Account';

@Component({
  selector: 'app-recipe-add',
  templateUrl: './recipe-add.component.html',
  styleUrls: ['./recipe-add.component.css']
})
export class RecipeAddComponent {
  public pageName = PageName;

  public newRecipe: RecipeDTO = {
    id: null,
    name: '',
    image: '',
    instructions: '',
    account: {} as Account
  }

  constructor(public ui: UiService, public recipeService: RecipeService) { }

  public addRecipeDTO(): void {
    this.recipeService.addRecipeDTO(this.newRecipe);
    this.ui.changePage(this.pageName.RECIPE);
    this.resetInputFields();
  }

  resetInputFields() {
    this.newRecipe = {
      id: null,
      name: '',
      image: '',
      instructions: '',
      account: {} as Account
    }
  }

  

}
