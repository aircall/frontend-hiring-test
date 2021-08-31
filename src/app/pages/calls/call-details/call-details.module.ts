import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CallDetailsComponent } from './call-details.component';

import { CallDetailsRoutes } from './calls-details.routing';

@NgModule({
  declarations: [CallDetailsComponent],
  imports: [CommonModule, CallDetailsRoutes],
})
export class CallDetailsModule {}
