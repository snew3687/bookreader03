import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';

import { DashboardComponent } from "./dashboard/dashboard.component";
import { ReaderComponent } from "./reader/reader.component";
import { ReadingAreaComponent } from "./reading-area/reading-area.component";

import { BookResolver } from "./reader/book-resolver.service";
import { ChapterResolver } from "./reading-area/chapter-resolver.service";

const routes: Route[] = [
  { path: 'dashboard', component: DashboardComponent },
  {
    path: 'reader/:bookUri', component: ReaderComponent,
    resolve: { bookDescriptor: BookResolver },
    children: [
      {
        path: '',
        redirectTo: 'chapter/0',
        pathMatch: 'full'
      },
      {
        path: 'chapter/:chapterNumber',
        component: ReadingAreaComponent,
        resolve: { chapterContent: ChapterResolver}
      }
    ]
  },
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [BookResolver, ChapterResolver]
})
export class AppRoutingModule { }
