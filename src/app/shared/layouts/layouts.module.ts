import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { PublicWrapperComponent } from './public-wrapper/public-wrapper.component';
import { PrivateWrapperComponent } from './private-wrapper/private-wrapper.component';
import { LoaderComponent, HeaderComponent } from './ui-kit';
import { NotificationService } from '@core/services/notification/notification.service';

@NgModule({
  declarations: [
    PublicWrapperComponent,
    PrivateWrapperComponent,
    LoaderComponent,
    HeaderComponent,
  ],
  exports: [PublicWrapperComponent, PrivateWrapperComponent, LoaderComponent],
  imports: [
    CommonModule,
    RouterModule,
    BrowserAnimationsModule,
    MatProgressSpinnerModule,
    MatButtonModule,
    MatIconModule,
  ],
  providers: [NotificationService],
})
export class LayoutsModule {}
