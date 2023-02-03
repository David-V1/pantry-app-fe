import { Injectable } from '@angular/core';
import { UiService } from './ui.service';
import { PageName } from '../enums/PageEnum';
import { Item } from '../models/Item';
import { HttpClient } from '@angular/common/http';
import {  Observable, Subject, take } from 'rxjs';
import { ItemDTO } from '../models/modelsDTO/ItemDTO';

@Injectable({
  providedIn: 'root'
})
export class ItemService {
  public pageName = PageName;
  public items: Item[] = [];
  public itemsDTO: ItemDTO[] = [];
  public currentUserItems: ItemDTO[] = [];
  
  private itemSubject: Subject<Item> = new Subject<Item>();
  public item$: Observable<Item> = this.itemSubject.asObservable();

  private itemsSubject: Subject<Item[]> = new Subject<Item[]>();
  public items$: Observable<Item[]> = this.itemsSubject.asObservable();

  private itemsDTOSubject: Subject<ItemDTO[]> = new Subject<ItemDTO[]>();
  public itemsDTO$: Observable<ItemDTO[]> = this.itemsDTOSubject.asObservable();

  private itemCategorySubject: Subject<number> = new Subject<number>();
  public itemCategory$: Observable<number> = this.itemCategorySubject.asObservable();

  private url = 'http://localhost:8080/item';

  private userId = Number(localStorage.getItem('userAccountId'))


  constructor(public ui: UiService, public http: HttpClient) {
    this.getAllItems();
  }

  // POST
  public addItem(item: Item): void {
    this.http.post<Item>(`${this.url}`, item)
    .pipe(take(1))
    .subscribe({
      next: () => {
        this.itemSubject.next(item);
        this.getAllItems();
        this.ui.openSnackBar(`${item.name} added to pantry`);
      },
      error: err => {
        console.error(err);
        this.ui.onError('Error adding item');
      }})
  }

  public addItemDTO(item: ItemDTO): void {
    this.http.post<ItemDTO>(`${this.url}/${this.userId}`, item)
    .pipe(take(1))
    .subscribe({
      next: () => {
        this.itemSubject.next(item);
        this.getAllItems();
        this.ui.openSnackBar(`${item.name} added to pantry`);
      },
      error: err => {
        console.log(err);
        this.ui.onError('Error adding item');
      }})
  }
  

  //GET
  public getAllItems(): void {
    this.http.get<Item[]>(this.url)
    .pipe(take(1))
    .subscribe({
      next: items => {
        this.items = items;
        this.itemsSubject.next(this.items);
      },
      error: err => {
        console.log(err);
        this.ui.onError('Error getting items');
      }
    })
  }

  public getAllItemsDTO(): void {
    this.http.get<ItemDTO[]>(`${this.url}`)
    .pipe(take(1))
    .subscribe({
      next: items => {
        this.itemsDTO = items;
        this.itemsDTOSubject.next(items);
      },
      error: err => {
        console.log(err);
        this.ui.onError('Error getting items');
      }
    })
  }

  public getItemById(id: number): void{
    //persist item view
    localStorage.setItem('selectedItemId', JSON.stringify(id));

    this.http.get<Item>(`${this.url}/${id}`).pipe(take(1))
    .subscribe({
      next: item => {
        this.itemSubject.next(item);
        this.getAllItems();
      },
      error: err => {
        console.log(err);
        this.ui.onError('Error getting item');
      }
    })
  }

  //PUT
  public updateItemById(item: Item): void {
    this.http.put<Item>(`${this.url}/${item.id}`, item)
    .pipe(take(1))
    .subscribe({
      next: () => {
        this.itemSubject.next(item);
        this.ui.openSnackBar('Item updated OK');
        this.getAllItems();
      },
      error: err => {
        console.log('Error inside of updateItemById()', err)
        console.error(err);
        this.ui.onError('Error updating item');
      }
    })
  }

  public updateItemQuantitiesOnCook(items: Item[]): void {
    // console.log('Array being sent to updateItemQuantitiesOnCook :', items)
    if (items.length === 0) return this.ui.onError('You don\'t have any items in your pantry');
    items.forEach((item) => {
      // console.log('Item being sent to update inside of updateItemQuantitiesOnCook forEach():', item)
      this.updateItemById(item);
    })
  }

  //DELETE
  public deleteItemById(item:Item): void {
    this.http.delete<Item>(`${this.url}/${item.id}`)
    .pipe(take(1))
      .subscribe({
        next: () => {
          this.getAllItems();
          this.ui.openSnackBar(`${item.name} deleted`);
        }
      })
    }

  // Contains [] items that match category
  public deletePantryItemsOnCook(items: Set<Item>): void {
    if (items.size === 0) return this.ui.onError('You don\'t have any items in your pantry');
    items.forEach(item => {
      this.deleteItemById(item);
    })
  }

  public whenSelectCategoryId(id: number): void {
    this.itemCategorySubject.next(id);
  }

}
