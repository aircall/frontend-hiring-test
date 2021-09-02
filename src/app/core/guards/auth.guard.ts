import { Injectable } from '@angular/core';
import { CanActivateChild, Router } from '@angular/router';
import { AuthService } from '@core/services/auth/auth.service';

@Injectable()
export class AuthGuard implements CanActivateChild {
  constructor(private _router: Router, private _auth: AuthService) {}

  canActivateChild(): boolean {
    if (!this._auth.isAuth) {
      this._router.navigate(['/login']).then(() => {
        this._auth.logOut();
      });
    }
    return this._auth.isAuth;
  }
}
