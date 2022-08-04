import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { EditComponent } from "./edit.component";

export const routes: Routes = [
  {
    path: "edit",
    component: EditComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild([])],
  exports: [RouterModule]
})
export class EditRoutingModule { }
