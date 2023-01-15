import { Component } from '@angular/core';
import { UiService } from 'src/app/services/ui.service';
import { PageName } from 'src/app/enums/PageEnum';
import { RecipeService } from 'src/app/services/recipe.service';

@Component({
  selector: 'app-recipe-add',
  templateUrl: './recipe-add.component.html',
  styleUrls: ['./recipe-add.component.css']
})
export class RecipeAddComponent {
  public pageName = PageName;

  public newRecipe = {
    id: null,
    name: '',
    image: '',
    instructions: ''
  }

  constructor(public ui: UiService, public recipeService: RecipeService) { }

  public onAddRecipe(): void {
    console.log(this.newRecipe);
    this.recipeService.addRecipe(this.newRecipe);
    this.ui.changePage(this.pageName.RECIPE);
    this.resetInputFields();
  }

  resetInputFields() {
    this.newRecipe = {
      id: null,
      name: '',
      image: '',
      instructions: ''
    }
  }

  

}
