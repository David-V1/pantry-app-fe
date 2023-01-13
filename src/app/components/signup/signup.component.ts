import { Component } from '@angular/core';
import { UiService } from 'src/app/services/ui.service';
import { AccountService } from 'src/app/services/account.service';
import { PageName } from 'src/app/enums/PageEnum';
import { Account } from 'src/app/models/Account';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  public pageName = PageName;
  public seeAddFamily: boolean = false;

  public newAccount: Account = {
    id: null,
    email: '',
    password: '',
    familyName: '',
  }

  public familyNames: String[] = ['Family name 1', 'Family name 2', 'Family name 3', 'Family name 4',]

  constructor(public ui: UiService, public accountService: AccountService) { }

  public toggleAddFamily() {
    this.seeAddFamily = !this.seeAddFamily;
  }

  public createAccount() {
    this.accountService.createAccount(this.newAccount);
    this.resetInputFields();
    
  }

  public resetInputFields() {
    this.newAccount.email = '';
    this.newAccount.password = '';
    this.newAccount.familyName = '';
  }

}
