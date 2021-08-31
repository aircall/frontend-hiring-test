import { Routes, RouterModule } from '@angular/router';

import { CallsComponent } from './calls.component';

const routes: Routes = [
  {
    path: '',
    component: CallsComponent,
    children: [
      {
        path: 'list',
        loadChildren: () =>
          import('./calls-list/calls-list.module').then(
            (m) => m.CallsListModule
          ),
      },
      {
        path: 'details/:id',
        loadChildren: () =>
          import('./call-details/call-details.module').then(
            (m) => m.CallDetailsModule
          ),
      },
    ],
  },
];

export const CallsRoutes = RouterModule.forChild(routes);
