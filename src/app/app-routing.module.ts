import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';

import { DashboardComponent } from "./dashboard/dashboard.component";
import { ReaderComponent } from "./reader/reader.component";
import { BookResolver } from "./reader/book-resolver.service";

const routes: Route[] = [
  { path: 'dashboard', component: DashboardComponent },
  { path: 'reader/:bookUri', component: ReaderComponent,
    resolve: { bookDescriptor: BookResolver }},
  { path: '', redirectTo: '/dashboard', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [BookResolver]
})
export class AppRoutingModule { }
