import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCardModule } from '@angular/material/card';

import { CallDetailsComponent } from './call-details.component';
import { CallDetailsRoutes } from './calls-details.routing';

@NgModule({
  declarations: [CallDetailsComponent],
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatToolbarModule,
    MatTabsModule,
    MatCardModule,
    CallDetailsRoutes,
  ],
})
export class CallDetailsModule {}
