import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { MatCheckboxModule } from '@angular/material/checkbox';

import { CallsListComponent } from './calls-list.component';
import { CallsListRoutes } from './calls-list.routing';
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
    MatCheckboxModule,
  ],
})
export class CallsListModule {}
