import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TranslateModule } from '@ngx-translate/core';

import { PageNotFoundComponent } from './components/';
import { WebviewDirective } from './directives/';
import { FormsModule } from '@angular/forms';
import { DisplayComponent } from './components/display/display.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';

import { MatDividerModule } from "@angular/material/divider";
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatSidenavModule } from "@angular/material/sidenav";
import { SafeStylePipe } from './pipes/safe-style-pipe.pipe';

@NgModule({
  declarations: [PageNotFoundComponent, WebviewDirective, DisplayComponent, SidebarComponent, SafeStylePipe],
  imports: [CommonModule, TranslateModule, FormsModule, MatDividerModule, MatIconModule, MatButtonToggleModule, MatSidenavModule, MatButtonModule],
  exports: [TranslateModule, WebviewDirective, FormsModule, DisplayComponent, SidebarComponent]
})
export class SharedModule {}
