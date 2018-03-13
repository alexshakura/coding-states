import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { MatDialogModule, MatTableModule, MatPaginatorModule } from '@angular/material';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { StructureTableComponent } from './structure-table/structure-table.component';


@NgModule({
  declarations: [
    AppComponent,
    StructureTableComponent
  ],
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    FormsModule,
    HttpModule,

    MatDialogModule,
    MatTableModule,
    MatPaginatorModule
 ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
