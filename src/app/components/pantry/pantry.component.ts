import { Component, OnDestroy } from '@angular/core';
import { UiService } from 'src/app/services/ui.service';
import { PageName } from 'src/app/enums/PageEnum';
import { Item } from 'src/app/models/Item';
import {ItemService} from 'src/app/services/item.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-pantry',
  templateUrl: './pantry.component.html',
  styleUrls: ['./pantry.component.css']
})
export class PantryComponent implements OnDestroy {
  public pageName = PageName;
  public items: Item[] = [];
  itemSubscription: Subscription;

  constructor(public ui: UiService, public itemService: ItemService) { 
    this.itemSubscription = this.itemService.items$.subscribe(items => this.items = items);
    this.itemService.getAllItems();
  }
  
  // public getItemCategories(): string[] {
  //   const categories: string[] = [];
  //   this.items.forEach(item => {
  //     if (!categories.includes(item.category)) {
  //       categories.push(item.category);
  //     }
  //   });
  //   return categories;
  // }

  public onSelectItem(item: Item): void {
    this.itemService.getItemById(item.id!);
    this.ui.changePage(this.pageName.ITEM_VIEW);
  }

  ngOnDestroy(): void {
    this.itemSubscription.unsubscribe();
  }

}
