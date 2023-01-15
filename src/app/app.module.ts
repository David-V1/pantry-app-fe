import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon'
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatProgressBarModule} from '@angular/material/progress-bar';


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
import { StartUpComponent } from './components/start-up/start-up.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { IngredientAddComponent } from './components/ingredient-add/ingredient-add.component';

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
    RecipeViewComponent,
    StartUpComponent,
    IngredientAddComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    BrowserAnimationsModule,
    MatSnackBarModule,
    MatIconModule,
    MatSlideToggleModule,
    MatProgressBarModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
