import { Component } from '@angular/core';
import { UiService } from 'src/app/services/ui.service';
import { PageName } from 'src/app/enums/PageEnum';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  public pageName = PageName;
  public seeAddFamily: boolean = false;

  public familyNames: String[] = ['Family name 1', 'Family name 2', 'Family name 3', 'Family name 4',]

  constructor(public ui: UiService) { }

  public toggleAddFamily() {
    this.seeAddFamily = !this.seeAddFamily;
  }

}
