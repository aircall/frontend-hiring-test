import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CallsListComponent } from './calls-list/calls-list.component';
import { CallsDetailsComponent } from './calls-details/calls-details.component';



@NgModule({
  declarations: [
    CallsListComponent,
    CallsDetailsComponent
  ],
  imports: [
    CommonModule
  ]
})
export class CallsModule { }
