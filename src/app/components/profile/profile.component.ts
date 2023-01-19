import { Component, OnDestroy, OnInit } from '@angular/core';
import { UiService } from 'src/app/services/ui.service';
import { PageName } from 'src/app/enums/PageEnum';
import { Account } from 'src/app/models/Account';
import { AccountService } from 'src/app/services/account.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit,OnDestroy {
  public pageName = PageName;
  public value: string = '';
  updatedAccount = {} as Account
  currentId = Number(localStorage.getItem('userAccountId'));
  public account = {} as Account;
  private accountSubscription: Subscription;

  constructor(public ui: UiService, public accountService: AccountService) { 
    this.accountSubscription = accountService.account$.subscribe(account => this.account = account);
    console.log(this.account)
    this.accountService.getAllAccounts();
  }
  ngOnInit(): void {
    
  }

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
    console.log(this.updatedAccount)
    this.accountService.updateAccount(this.currentId, this.updatedAccount);
    this.resetFields();
  }

  public deleteAccount(): void {
    this.accountService.deleteAccount(this.currentId);
    // console.log(this.currentId);
    this.ui.changePage(this.pageName.START_UP)
  }

  resetFields() {
    this.updatedAccount = {} as Account;
  }

  ngOnDestroy(): void {
    this.accountSubscription.unsubscribe();
  }

}
