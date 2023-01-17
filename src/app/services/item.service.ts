import { Injectable } from '@angular/core';
import { UiService } from './ui.service';
import { PageName } from '../enums/PageEnum';
import { Item } from '../models/Item';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, map, Observable, Subject, take, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ItemService {
  public pageName = PageName;
  public items: Item[] = [];
  
  private itemSubject: Subject<Item> = new Subject<Item>();
  public item$: Observable<Item> = this.itemSubject.asObservable();

  private itemsSubject: Subject<Item[]> = new Subject<Item[]>();
  public items$: Observable<Item[]> = this.itemsSubject.asObservable();

  private url = 'http://localhost:8080/item';


  constructor(public ui: UiService, public http: HttpClient) { 
    this.getAllItems();
  }

  // POST
  public addItem(item: Item): void {
    this.http.post<Item>(`${this.url}`, item)
    .pipe(take(1))
    .subscribe({
      next: item => {
        this.itemSubject.next(item);
        this.getAllItems();
        this.ui.openSnackBar('Item added OK');
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

  public getItemById(id: number): void{
    //persist item view
    localStorage.setItem('selectedItemId', JSON.stringify(id));

    this.http.get<Item>(`${this.url}/${id}`).pipe(take(1))
    .subscribe({
      next: item => {
        this.itemSubject.next(item);
        
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
        this.getAllItems();
        this.ui.openSnackBar('Item updated OK');
      },
      error: err => {
        console.log(err);
        this.ui.onError('Error updating item');
      }
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

  public deletePantryItemsOnCook(items: Item[]): void {
    if (items.length === 0) return this.ui.onError('Something went wrong');
    items.forEach(item => {
      this.deleteItemById(item);
      
    })
  }

}
