import { Component } from '@angular/core';
import { UiService } from 'src/app/services/ui.service';
import { PageName } from 'src/app/enums/PageEnum';
import { AccountService } from 'src/app/services/account.service';
import { Account } from 'src/app/models/Account';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  public pageName = PageName;
  public showLogin: boolean = true;
  public newLogin = {
    email: '',
    password: ''
  }
  // SIGNUP
  public newAccount: Account = {
    id: null,
    email: '',
    password: '',
    familyName: '',
  }

  constructor(public ui: UiService, public accountService: AccountService) { }

  onLogin(): void {
    this.accountService.getAccount(this.newLogin.email, this.newLogin.password);
    this.resetInputFields();
  }
  // SIGNUP
  public createAccount() {
    if (this.newAccount.familyName === '') return this.ui.onError('Please enter a family name');
    if (this.newAccount.email === '') return this.ui.onError('Please enter an email');
    if (this.newAccount.password === '') return this.ui.onError('Please enter a password');

    this.accountService.createAccount(this.newAccount);
    this.accountService.getAllAccounts();
    this.showLogin = !this.showLogin;
    this.ui.openSnackBar(`Account created for ${this.newAccount.familyName}`);
    this.resetInputFields();
    
  }
  public onSingUp(): void {
    this.showLogin = !this.showLogin;
  }

  resetInputFields(): void {
    this.newLogin.email = '';
    this.newLogin.password = '';
  }

}
