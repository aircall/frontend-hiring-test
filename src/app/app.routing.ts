import { Routes, RouterModule } from '@angular/router';

import { PrivateWrapperComponent } from '@shared/layouts/private-wrapper/private-wrapper.component';
import { PublicWrapperComponent } from '@shared/layouts/public-wrapper/public-wrapper.component';

const routes: Routes = [
  { path: '', redirectTo: 'welcome', pathMatch: 'full' },
  {
    path: '',
    component: PublicWrapperComponent,
    children: [
      {
        path: 'welcome',
        loadChildren: () =>
          import('./pages/welcome/welcome.module').then((m) => m.WelcomeModule),
      },
      {
        path: 'login',
        loadChildren: () =>
          import('./pages/login/login.module').then((m) => m.LoginModule),
      },
      {
        path: '404',
        loadChildren: () =>
          import('./pages/not-found/not-found.module').then(
            (m) => m.NotFoundModule
          ),
      },
    ],
  },
  {
    path: 'private',
    component: PrivateWrapperComponent,
    canActivateChild: [],
    children: [
      {
        path: 'calls',
        loadChildren: () =>
          import('./pages/calls/calls.module').then((m) => m.CallsModule),
      },
    ],
  },
  { path: '**', redirectTo: '404' },
];

export const AppRoutes = RouterModule.forChild(routes);
