import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon'
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatDialogModule} from '@angular/material/dialog';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';


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
import { ItemEditComponent } from './components/item-edit/item-edit.component';

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
    IngredientAddComponent,
    ItemEditComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    BrowserAnimationsModule,
    MatSnackBarModule,
    MatIconModule,
    MatSlideToggleModule,
    MatProgressBarModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
