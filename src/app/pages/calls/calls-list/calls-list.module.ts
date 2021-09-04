import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MatIconModule } from '@angular/material/icon';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';

import { CallsListComponent } from './calls-list.component';
import { CallsListRoutes } from './calls-list.routing';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { FilterByFieldPipe } from '@shared/pipes/filter-by-field.pipe';

@NgModule({
  declarations: [CallsListComponent, FilterByFieldPipe],
  imports: [
    CommonModule,
    FormsModule,
    CallsListRoutes,
    MatIconModule,
    MatButtonModule,
    MatToolbarModule,
    MatButtonToggleModule,
    MatMenuModule,
  ],
})
export class CallsListModule {}
