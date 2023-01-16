import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PageName } from '../enums/PageEnum';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Account } from '../models/Account';

@Injectable({
  providedIn: 'root'
})
export class UiService {
  public pageName: PageName;
  public isLoggedIn = false;
  // general FDA food groups
  public foodGroups = ['Dairy & Alternatives', 'Fruits', 'Grains', 'Meat, Fish, Egg & Alternatives', 'Vegetables', 'Fat/Oil, Salt & Sugar', 'Other'];

  constructor(private http: HttpClient, private _snackBar: MatSnackBar) {
    //local storage persist page 
    localStorage.getItem('pageName') ? this.pageName = Number(localStorage.getItem('pageName')) : this.pageName = PageName.START_UP;
  }

  public onValidLogin(currentAccount: Account): void {
    this.isLoggedIn = true;
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('email', currentAccount.email);
    localStorage.setItem('password', currentAccount.password);
  }

  public onLogout(): void {
    this.isLoggedIn = false;
    localStorage.setItem('isLoggedIn', 'false');
    localStorage.removeItem('email');
    localStorage.removeItem('password');
  }

  public changePage(page: PageName): void {
    localStorage.setItem('pageName', page.toString());
    this.pageName = page;
  }

  public onError(msg: string): void {
    this._snackBar.open(msg, undefined, {
      duration: 3000
    })
  }

  public openSnackBar(msg: string): void {
    this._snackBar.open(msg, "close", {
      duration: 4000
    })
  }
  
}
