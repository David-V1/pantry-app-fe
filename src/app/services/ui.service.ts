import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PageName } from '../enums/PageEnum';

@Injectable({
  providedIn: 'root'
})
export class UiService {
  public pageName: PageName = PageName.START_UP;

  constructor(private http: HttpClient) {
    //local storage persist page 
    localStorage.getItem('pageName') ? this.pageName = Number(localStorage.getItem('pageName')) : this.pageName = PageName.START_UP;
  }

  public changePage(page: PageName): void {
    localStorage.setItem('pageName', page.toString());
    this.pageName = page;
  }
}
