import { Component } from '@angular/core';
import { UiService } from 'src/app/services/ui.service';
import { AccountService } from 'src/app/services/account.service';
import { PageName } from 'src/app/enums/PageEnum';
import { Account } from 'src/app/models/Account';
import { NgForm } from '@angular/forms';
import { map } from 'rxjs';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  public pageName = PageName;
  public seeAddFamily: boolean = false;
  public familyNames: String[] = [];


  public newAccount: Account = {
    id: null,
    email: '',
    password: '',
    familyName: '',
  }



  constructor(public ui: UiService, public accountService: AccountService) {
    this.accountService.whenAccountsUpdate()
    .pipe(map(accounts => accounts.map(account => account.familyName))) //{[],[]}
    .subscribe(familyNames => {
      this.familyNames = familyNames;
    });
  }

  public toggleAddFamily() {
    this.seeAddFamily = !this.seeAddFamily;
  }

  public createAccount() {
    if (this.newAccount.familyName === '') return;
    if (this.newAccount.email === '') return;
    if (this.newAccount.password === '') return;

    this.accountService.createAccount(this.newAccount);
    this.accountService.getAllAccounts();
    this.resetInputFields();
    
  }

  public resetInputFields() {
    this.newAccount.email = '';
    this.newAccount.password = '';
    this.newAccount.familyName = '';
  }

  
}
