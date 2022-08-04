import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home.component';

import { routes as EditRoutes } from "./components/edit/edit-routing.module";
import { routes as SetupRoutes } from "./components/setup/setup-routing.module";

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    children: [
      {
        path: '',
        children: [
          ...EditRoutes,
          ...SetupRoutes
        ]
      }
    ]
  },
  ...EditRoutes,
  ...SetupRoutes
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
