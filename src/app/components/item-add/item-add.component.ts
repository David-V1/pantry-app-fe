import { Component, OnInit } from '@angular/core';
import { ItemService } from 'src/app/services/item.service';
import { Item } from 'src/app/models/Item';
import { UiService } from 'src/app/services/ui.service';
import { PageName } from 'src/app/enums/PageEnum';
import { distinct, filter, map, tap } from 'rxjs';
import { ConstantPool } from '@angular/compiler';

@Component({
  selector: 'app-item-add',
  templateUrl: './item-add.component.html',
  styleUrls: ['./item-add.component.css']
})
export class ItemAddComponent implements OnInit {
  public pageName = PageName;
  public slider = false
  public metricUnits = ['grams', 'kilograms'];
  public currentCategories: string[] = [];

  public newItem: Item = {
    id: null,
    name: '',
    image: '',
    weight: 0,
    metric: '',
    quantity: 0,
    calories: 0,
    category: ''
  }

  constructor(public itemService: ItemService, public ui: UiService) {
    this.itemService.items$
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

   

    
    public onAddItem(): void {
      console.log(this.newItem);
      if (this.newItem.name === '' ) return this.ui.onError('Please Enter a name for the item');
      if (this.newItem.weight <= 0 && this.newItem.metric === '' && this.newItem.quantity === 0) return this.ui.onError('Please enter a measurement for the item');
      if (this.newItem.weight !== 0 && this.newItem.metric === '') return this.ui.onError('Please select a metric for the item');

      if (this.newItem.weight < 0 ) return this.ui.onError('Weight must be greater than 0');
      if (this.newItem.quantity < 0 ) return this.ui.onError('Quantity must be greater than 0');
      if (this.newItem.calories <= 0 ) return this.ui.onError('Calories must be greater than 0');
      if (this.newItem.category === '') return this.ui.onError('Please select a category for the item');

     
      this.itemService.addItem(this.newItem);
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
        category: ''
      }
    }

}
