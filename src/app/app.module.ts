import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule }   from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './/app-routing.module';

import { AppComponent } from './app.component';
import { MainComponent } from './main/main.component';
import { SvgsketchComponent, SketchPopupDialog } from './svgsketch/svgsketch.component';
import { SleepartComponent } from './sleepart/sleepart.component';
import { DarelcareyComponent } from './darelcarey/darelcarey.component';


@NgModule({
  declarations: [
    AppComponent,
    MainComponent,
    SvgsketchComponent,
    SketchPopupDialog,
    SleepartComponent,
    DarelcareyComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    AppRoutingModule,
    MatDialogModule
  ],
  entryComponents: [
    SketchPopupDialog
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
