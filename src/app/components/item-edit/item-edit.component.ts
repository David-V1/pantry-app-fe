import { Component, OnDestroy } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { Item } from 'src/app/models/Item';
import { ItemService } from 'src/app/services/item.service';
import { RecipeService } from 'src/app/services/recipe.service';
import { UiService } from 'src/app/services/ui.service';

@Component({
  selector: 'app-item-edit',
  templateUrl: './item-edit.component.html',
  styleUrls: ['./item-edit.component.css']
})
export class ItemEditComponent implements OnDestroy {
  isChecked: boolean = false;
  updatedItem: Item ={} as Item; // xfer to dialog
  item: Item = {} as Item; // casting current item info to input fields
  public metricUnits = this.recipeService.recipeVolumeOptions;
  public itemSub: Subscription;

  constructor(public ui: UiService, private matDialogRef: MatDialogRef<ItemEditComponent>, public itemService: ItemService, public recipeService: RecipeService) {
    this.itemSub = this.itemService.item$.subscribe(item => {
      this.item = item;

    })
    this.itemService.getItemById(Number(localStorage.getItem('selectedItemId')));
  }
  
  public dialogValues(): void {
    const newData: Item = {
      id: this.updatedItem.id,
      name: this.updatedItem.name,
      image: this.updatedItem.image,
      weight: this.updatedItem.weight,
      metric: this.updatedItem.metric,
      quantity: this.updatedItem.quantity,
      calories: this.updatedItem.calories,
      category: this.updatedItem.category
    }
    this.matDialogRef.close(newData);
  }

  onCancel(): void {
    this.matDialogRef.close();
  }

  ngOnDestroy(): void {
    this.itemSub.unsubscribe();
  }
}
