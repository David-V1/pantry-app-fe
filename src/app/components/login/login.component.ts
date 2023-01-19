import { Component } from '@angular/core';
import { UiService } from 'src/app/services/ui.service';
import { PageName } from 'src/app/enums/PageEnum';
import { AccountService } from 'src/app/services/account.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  public pageName = PageName;
  public newLogin = {
    email: '',
    password: ''
  }

  constructor(public ui: UiService, public accountService: AccountService) { }

  onLogin(): void {
    this.accountService.getAccount(this.newLogin.email, this.newLogin.password);
    this.resetInputFields();
  }

  resetInputFields(): void {
    this.newLogin.email = '';
    this.newLogin.password = '';
  }

}
