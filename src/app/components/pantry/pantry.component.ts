import { Component, OnDestroy, Input } from '@angular/core';
import { UiService } from 'src/app/services/ui.service';
import { PageName } from 'src/app/enums/PageEnum';
import { Item } from 'src/app/models/Item';
import {ItemService} from 'src/app/services/item.service';
import { map, pipe, Subscription, tap } from 'rxjs';
import { ItemDTO } from 'src/app/models/modelsDTO/ItemDTO';

@Component({
  selector: 'app-pantry',
  templateUrl: './pantry.component.html',
  styleUrls: ['./pantry.component.css']
})
export class PantryComponent implements OnDestroy {
  public pageName = PageName;
  // public items: Item[] = []; // This is the original line
  public items: ItemDTO[] = [];
  public categories: string[] = [];
  itemSubscription: Subscription;
  public showAllItems = true;
  public dropdownSelection: string = '';

  constructor(public ui: UiService, public itemService: ItemService) { 
    this.itemService.getAllItemsDTO();

    this.itemSubscription = this.itemService.itemsDTO$
    .pipe(
      map(items => items.filter(item => item.account.id === this.ui.currentUserId)),
      tap(i => console.log(i))
    )
    .subscribe(itemsDTO =>{ 
      this.items = itemsDTO
      console.log(this.items)
    });
    this.itemService.getAllItemsDTO();
  }

  public onSelectItem(item: Item): void {
    this.itemService.getItemById(item.id!);
    this.ui.changePage(this.pageName.ITEM_VIEW);
  }

  public hideAllItems(): void {
    this.showAllItems = false;
  }

  public onAllPantryItems(): void {
    this.showAllItems = true;
    this.dropdownSelection = '';
  }

  public categoriess(): string[] {
    const categories: string[] = [];
    this.items.forEach(item => {
      if (!categories.includes(item.category)) {
        categories.push(item.category);
      }
    });
    return categories;
  }

  ngOnDestroy(): void {
    this.itemSubscription.unsubscribe();
  }

}
