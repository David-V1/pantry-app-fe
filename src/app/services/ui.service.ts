import { HttpClient } from '@angular/common/http';
import { Injectable} from '@angular/core';
import { PageName } from '../enums/PageEnum';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Account } from '../models/Account';

@Injectable({
  providedIn: 'root'
})
export class UiService {
  public pageName: Number = PageName.LOGIN;
  public isLoggedIn = false;
  public currentUserId: number = Number(localStorage.getItem('userAccountId'));
  public foodGroups = ['Dairy & Alternatives', 'Fruits', 'Grains', 'Meat, Fish, Egg & Alternatives', 'Vegetables', 'Fat/Oil, Salt & Sugar', 'Other'];

  constructor(private http: HttpClient, private _snackBar: MatSnackBar) {
    //local storage persist page 
    localStorage.getItem('isLoggedIn') !== 'false'  ? this.pageName = Number(localStorage.getItem('pageName')) : this.pageName = PageName.LOGIN;
  }

  public onValidLogin(currentAccount: Account): void {
    localStorage.setItem('email', currentAccount.email);
    localStorage.setItem('password', currentAccount.password);
    localStorage.setItem('userAccountId', currentAccount.id!.toString());
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('familyName', currentAccount.familyName);
    this.isLoggedIn = true;
    location.reload();
  }
  public onUpdateAccount(updatedAccount: Account): void {
    localStorage.removeItem('email');
    localStorage.removeItem('password');
    localStorage.setItem('email', updatedAccount.email);
    localStorage.setItem('password', updatedAccount.password);
  }

  public onLogout(): void {
    this.isLoggedIn = false;
    localStorage.setItem('isLoggedIn', 'false');
    localStorage.removeItem('email');
    localStorage.removeItem('password');
    localStorage.removeItem('userAccountId');
    localStorage.removeItem('familyName');
    localStorage.removeItem('selectedRecipeId');
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
