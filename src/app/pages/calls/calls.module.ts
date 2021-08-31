import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CallsComponent } from './calls.component';
import { CallsRoutes } from './calls.routing';

@NgModule({
  declarations: [CallsComponent],
  imports: [CommonModule, CallsRoutes],
})
export class CallsModule {}
