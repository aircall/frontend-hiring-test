import { Routes, RouterModule } from '@angular/router';

import { CallsComponent } from './calls.component';

const routes: Routes = [
  {
    path: '',
    component: CallsComponent,
    children: [
      {
        path: 'list',
        data: {
          depth: 1,
        },
        loadChildren: () =>
          import('./calls-list/calls-list.module').then(
            (m) => m.CallsListModule
          ),
      },
      {
        path: 'details/:id',
        data: {
          depth: 2,
        },
        loadChildren: () =>
          import('./call-details/call-details.module').then(
            (m) => m.CallDetailsModule
          ),
      },
    ],
  },
];

export const CallsRoutes = RouterModule.forChild(routes);
