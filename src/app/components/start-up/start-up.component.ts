import { Component } from '@angular/core';
import { UiService } from '../../services/ui.service';
import { PageName } from '../../enums/PageEnum';

@Component({
  selector: 'app-start-up',
  templateUrl: './start-up.component.html',
  styleUrls: ['./start-up.component.css']
})
export class StartUpComponent {
  public pageName = PageName;

  constructor(public ui: UiService) { }

  public onLogin(): void {
    this.ui.changePage(PageName.LOGIN);
  }

  public onSignup(): void {
    this.ui.changePage(PageName.SIGNUP);
  }

}
