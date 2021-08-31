import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CallsListComponent } from './calls-list.component';
import { CallsListRoutes } from './calls-list.routing';

@NgModule({
  declarations: [CallsListComponent],
  imports: [CommonModule, CallsListRoutes],
})
export class CallsListModule {}
