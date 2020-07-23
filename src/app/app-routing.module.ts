import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {SearchComponent} from './components/search/search.component';
import {RegisterComponent} from './components/register/register.component';

const routes: Routes = [
  {path: 'find', component: SearchComponent},
  {path: 'register', component: RegisterComponent},
  { path: '',   redirectTo: '/find', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
