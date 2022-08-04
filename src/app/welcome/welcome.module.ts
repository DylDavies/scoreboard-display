import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WelcomeRoutingModule } from './welcome-routing.module';

import { WelcomeComponent } from './welcome.component';
import { SharedModule } from '../shared/shared.module';

import { MatCardModule } from "@angular/material/card";
import { MatDividerModule } from "@angular/material/divider";
import { MatListModule } from "@angular/material/list";
import { MatIconModule } from "@angular/material/icon";
import { ScrollingModule } from '@angular/cdk/scrolling';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from "@angular/material/input";
import { CreateProjectFormComponent } from './components/create-project-form/create-project-form.component';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from "@angular/material/button";

@NgModule({
  declarations: [WelcomeComponent, CreateProjectFormComponent],
  imports: [CommonModule,
    SharedModule,
    WelcomeRoutingModule,
    MatCardModule,
    MatDividerModule,
    MatListModule,
    MatIconModule,
    ScrollingModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule
  ]
})
export class WelcomeModule {}
