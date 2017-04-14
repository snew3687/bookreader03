import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ReaderComponent } from './reader/reader.component';
import { BookmarkSummaryComponent } from './bookmark-summary/bookmark-summary.component';

import { BookLibraryService } from "./book-library.service";

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    ReaderComponent,
    BookmarkSummaryComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    AppRoutingModule
  ],
  providers: [ BookLibraryService ],
  bootstrap: [AppComponent]
})
export class AppModule { }
