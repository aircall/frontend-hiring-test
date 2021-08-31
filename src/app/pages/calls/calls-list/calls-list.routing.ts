import { Routes, RouterModule } from '@angular/router';

import { CallsListComponent } from './calls-list.component';

const routes: Routes = [
  {
    path: '',
    component: CallsListComponent,
  },
];

export const CallsListRoutes = RouterModule.forChild(routes);
