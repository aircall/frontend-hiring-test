import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { PublicWrapperComponent } from './public-wrapper/public-wrapper.component';
import { PrivateWrapperComponent } from './private-wrapper/private-wrapper.component';

@NgModule({
  declarations: [PublicWrapperComponent, PrivateWrapperComponent],
  exports: [PublicWrapperComponent, PrivateWrapperComponent],
  imports: [CommonModule, RouterModule],
})
export class LayoutsModule {}
