import { Routes, RouterModule } from '@angular/router';

import { NotFoundComponent } from './not-found.component';

const routes: Routes = [
  {
    path: '',
    component: NotFoundComponent,
  },
];

export const NotFoundRoutes = RouterModule.forChild(routes);
