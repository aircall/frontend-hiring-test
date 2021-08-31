import { Routes, RouterModule } from '@angular/router';

import { CallDetailsComponent } from './call-details.component';

const routes: Routes = [
  {
    path: '',
    component: CallDetailsComponent,
  },
];

export const CallDetailsRoutes = RouterModule.forChild(routes);
