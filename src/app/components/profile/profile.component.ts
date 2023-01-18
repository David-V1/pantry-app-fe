import { Component } from '@angular/core';
import { UiService } from 'src/app/services/ui.service';
import { PageName } from 'src/app/enums/PageEnum';
import { Account } from 'src/app/models/Account';
import { AccountService } from 'src/app/services/account.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent {
  public pageName = PageName;
  public value: string = '';
  updatedAccount = {} as Account
  currentId = Number(localStorage.getItem('userAccountId'));

  constructor(public ui: UiService, public accountService: AccountService) { }

  public onLogout(): void {
    this.ui.changePage(this.pageName.START_UP);
  }

  onUpdateAccount() {
    if (this.updatedAccount.email === undefined) {
      this.ui.onError('Email cannot be empty')
      return;
    }
    if (this.updatedAccount.password === undefined) {
      this.ui.onError('Password cannot be empty');
      return;
    }
    if (this.updatedAccount.familyName === undefined) {
      this.ui.onError('Family name cannot be empty');
      return;
    }
    this.accountService.updateAccount(this.currentId, this.updatedAccount);
    this.resetFields();
  }

  resetFields() {
    this.updatedAccount = {} as Account;
  }

}
