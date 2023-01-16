import { Component } from '@angular/core';
import { UiService } from 'src/app/services/ui.service';
import { PageName } from 'src/app/enums/PageEnum';
import { Item } from 'src/app/models/Item';
import { ItemService } from 'src/app/services/item.service';

@Component({
  selector: 'app-item-view',
  templateUrl: './item-view.component.html',
  styleUrls: ['./item-view.component.css']
})
export class ItemViewComponent {
public pageName = PageName;

constructor(public ui: UiService, public itemService: ItemService) { 
  this.itemService.getItemById(Number(localStorage.getItem('selectedItemId')));
}

goBackClick(): void {
  this.ui.changePage(this.pageName.PANTRY);
  localStorage.removeItem('selectedItemId');
}

}
