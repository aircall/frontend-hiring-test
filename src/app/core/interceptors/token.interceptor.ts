import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Observable } from 'rxjs';

import { AuthService } from '@core/services/auth/auth.service';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  private authPrefix: string = 'Bearer';

  constructor(private _auth: AuthService) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const tokenExists =
      this._auth && this._auth.token && this._auth.token.length;
    if (tokenExists) {
      request = request.clone({
        setHeaders: {
          Authorization: `${this.authPrefix} ${this._auth.token}`,
        },
      });
    }
    return next.handle(request);
  }
}
