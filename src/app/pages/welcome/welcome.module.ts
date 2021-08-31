import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';
import { MatRadioModule } from '@angular/material/radio';

import { WelcomeComponent } from './welcome.component';
import { WelcomeRoutes } from './welcome.routing';

@NgModule({
  declarations: [WelcomeComponent],
  imports: [
    CommonModule,
    FormsModule,
    WelcomeRoutes,
    MatButtonModule,
    MatRadioModule,
  ],
})
export class WelcomeModule {}
