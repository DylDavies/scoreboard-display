import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SetupComponent } from './setup.component';

export const routes: Routes = [
  {
    path: 'setup',
    component: SetupComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild([])],
  exports: [RouterModule]
})
export class SetupRoutingModule { }
