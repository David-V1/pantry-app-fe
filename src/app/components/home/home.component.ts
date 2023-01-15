import { Component } from '@angular/core';
import { UiService } from 'src/app/services/ui.service';
import { PageName } from 'src/app/enums/PageEnum';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  public pageName = PageName;

  constructor(public ui: UiService) { }

  public onViewRecipes(): void {
    this.ui.changePage(PageName.RECIPE);
  }

}
