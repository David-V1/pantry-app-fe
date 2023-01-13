import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { SignupComponent } from './components/signup/signup.component';
import { HomeComponent } from './components/home/home.component';
import { PantryComponent } from './components/pantry/pantry.component';
import { ItemAddComponent } from './components/item-add/item-add.component';
import { ItemViewComponent } from './components/item-view/item-view.component';
import { RecipeComponent } from './components/recipe/recipe.component';
import { RecipeAddComponent } from './components/recipe-add/recipe-add.component';
import { RecipeViewComponent } from './components/recipe-view/recipe-view.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SignupComponent,
    HomeComponent,
    PantryComponent,
    ItemAddComponent,
    ItemViewComponent,
    RecipeComponent,
    RecipeAddComponent,
    RecipeViewComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
