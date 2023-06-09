import { Component, OnDestroy, OnInit } from '@angular/core';
import { ItemService } from 'src/app/services/item.service';
import { UiService } from 'src/app/services/ui.service';
import { PageName } from 'src/app/enums/PageEnum';
import { map, Subscription } from 'rxjs';
import { RecipeService } from 'src/app/services/recipe.service';
import { Account } from 'src/app/models/Account';
import { ItemDTO } from 'src/app/models/modelsDTO/ItemDTO';

@Component({
  selector: 'app-item-add',
  templateUrl: './item-add.component.html',
  styleUrls: ['./item-add.component.css']
})
export class ItemAddComponent implements OnInit, OnDestroy {
  public pageName = PageName;
  public slider = false
  public metricUnits = this.recipeService.recipeVolumeOptions;
  public currentCategories: string[] = [];
  editMode = false;
  itemSubscription: Subscription

  public newItem: ItemDTO = {
    id: null,
    name: '',
    image: '',
    weight: 0,
    metric: '',
    quantity: 0,
    calories: 0,
    category: '',
    account: {} as Account
  }

  constructor(public itemService: ItemService, public ui: UiService, public recipeService: RecipeService) {
    this.itemSubscription = this.itemService.items$
    .pipe(map(items => items.map(item => item.category)))
    .subscribe(categories => {
      categories.forEach(category => {
        if (!this.currentCategories.includes(category)) {
          this.currentCategories.push(category);
        }
      })
    });
   }
  
   ngOnInit(): void {
      this.itemService.getAllItems();

   }
  
    public onAddItemDTO(): void {
      if (this.newItem.name === '' ) return this.ui.onError('Please Enter a name for the item');
      if (this.newItem.weight <= 0 && this.newItem.metric === '' && this.newItem.quantity === 0) return this.ui.onError('Please enter a measurement for the item');
      if (this.newItem.weight !== 0 && this.newItem.metric === '') return this.ui.onError('Please select a metric for the item');

      if (this.newItem.weight < 0 ) return this.ui.onError('Weight must be greater than 0');
      if (this.newItem.quantity < 0 ) return this.ui.onError('Quantity must be greater than 0');
      if (this.newItem.calories <= 0 ) return this.ui.onError('Calories must be greater than 0');
      if (this.newItem.category === '') return this.ui.onError('Please select a category for the item');

     
      this.itemService.addItemDTO(this.newItem);
      this.resetFields();
    }

    public resetFields(): void {
      this.newItem = {
        id: null,
        name: '',
        image: '',
        weight: 0,
        metric: '',
        quantity: 0,
        calories: 0,
        category: '',
        account: {} as Account
      }
    }
    public goBackClick(): void{
      this.ui.changePage(this.pageName.PANTRY)
    }

    hideEdit(): void {
      this.editMode = false;
    }

    ngOnDestroy(): void {
      this.itemSubscription.unsubscribe();
    }

}
