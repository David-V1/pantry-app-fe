import { Component } from '@angular/core';
import { UiService } from 'src/app/services/ui.service';
import { PageName } from 'src/app/enums/PageEnum';
import { Item } from 'src/app/models/Item';
import { ItemService } from 'src/app/services/item.service';
import {MatDialog} from '@angular/material/dialog';
import { ItemEditComponent } from '../item-edit/item-edit.component';

@Component({
  selector: 'app-item-view',
  templateUrl: './item-view.component.html',
  styleUrls: ['./item-view.component.css']
})
export class ItemViewComponent {
  public pageName = PageName;

  constructor(public ui: UiService, public itemService: ItemService, public dialog: MatDialog) { 
    this.itemService.getItemById(Number(localStorage.getItem('selectedItemId')));
  }

  goBackClick(): void {
    this.ui.changePage(this.pageName.PANTRY);
    localStorage.removeItem('selectedItemId');
  }

  public deleteItem(item:Item): void{
    this.itemService.deleteItemById(item);
    this.ui.changePage(this.pageName.PANTRY);
  }

  openDialog(item: Item): void {
    // data passing
    const dialogRef = this.dialog.open(ItemEditComponent);

    //values from dialog
    dialogRef.afterClosed().subscribe(result => {
      // Clicks outside dialog box
      if (result === undefined) return;

      if (result.weight === undefined && result.metric) return this.ui.onError('Please enter a weight');
      if (result.metric === undefined && result.weight) return this.ui.onError('Please enter a unit of measurement');
      if (result.name === undefined) return this.ui.onError('Please Enter a name');
      if (result.calories === undefined) return this.ui.onError('Please enter a calorie count');
      if (result.category === undefined) return this.ui.onError('Please enter a category');

      const newUpdatedItem: Item = {
        ...item,
        name: result.name,
        image: result.image,
        weight: result.weight,
        metric: result.metric,
        quantity: result.quantity,
        calories: result.calories,
        category: result.category
      }
      this.itemService.updateItemById(newUpdatedItem);
      location.reload();
    });
    // this.ui.changePage(this.pageName.PANTRY);
  }

}
