import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LayoutsModule } from './layouts/layouts.module';

@NgModule({
  exports: [LayoutsModule],
  imports: [CommonModule],
})
export class SharedModule {
  static forRoot(): ModuleWithProviders<SharedModule> {
    return { ngModule: SharedModule };
  }
}
