import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';

import { DashboardComponent } from "./dashboard/dashboard.component";
import { ReaderComponent } from "./reader/reader.component";

const routes: Route[] = [
  { path: 'dashboard', component: DashboardComponent },
  { path: 'reader', component: ReaderComponent },
  { path: '', redirectTo: '/dashboard', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
