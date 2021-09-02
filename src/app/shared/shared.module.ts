import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LayoutsModule } from './layouts/layouts.module';
import { CoreModule } from '@core/core.module';

@NgModule({
  exports: [LayoutsModule],
  imports: [CommonModule, CoreModule],
})
export class SharedModule {
  static forRoot(): ModuleWithProviders<SharedModule> {
    return { ngModule: SharedModule };
  }
}
