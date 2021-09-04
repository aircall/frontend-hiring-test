import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { tap, map } from 'rxjs/operators';

import { IAuth } from '@core/models/auth.interface';
import { RequestService } from '../request/request.service';
import { IUser } from '@core/models/user.interface';
import { localStorageKeys } from '@core/constants/local-storage-keys.constant';

@Injectable()
export class AuthService {
  private _authRefreshInterval: any;
  constructor(private _requestService: RequestService) {}

  public auth(user: IAuth): Observable<IUser> {
    return this._requestService.auth(user).pipe(
      tap((res) => this.manageAccessToken(res.access_token)),
      map((res) => res.user)
    );
  }

  public get token(): string {
    return localStorage.getItem(localStorageKeys.accessToken) || '';
  }

  public set token(value: string) {
    localStorage.setItem(localStorageKeys.accessToken, value);
  }

  public get isAuth(): boolean {
    return !!localStorage.getItem(localStorageKeys.accessToken);
  }

  public logOut(): void {
    this.token = '';
  }

  private manageAccessToken(token: string): void {
    this.token = token;
    if (this._authRefreshInterval) {
      clearInterval(this._authRefreshInterval);
    }
    this._authRefreshInterval = setInterval(() => this.refreshToken(), 50000);
  }

  private refreshToken(): void {
    console.info('Token refreshed');
    this._requestService.refreshToken().subscribe(
      (token) => {
        this.token = token;
      },
      (_) => {
        this.logOut();
      }
    );
  }
}
