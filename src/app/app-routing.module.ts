import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PageNotFoundComponent } from './shared/components';

import { WelcomeRoutingModule } from './welcome/welcome-routing.module';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import("./home/home.module").then(m => m.HomeModule),
  },
  {
    path: 'home',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: '**',
    component: PageNotFoundComponent
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' }),
    WelcomeRoutingModule
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
