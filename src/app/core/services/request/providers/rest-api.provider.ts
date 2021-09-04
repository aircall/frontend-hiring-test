import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from 'src/environments/environment';

import { IAuth } from '@core/models/auth.interface';
import { IRequestProvider } from '@core/models/request-provider.interface';
import { IUser } from '@core/models/user.interface';

export class RestAPIProvider implements IRequestProvider {
  constructor(private _httpClient: HttpClient) {}

  public auth(user: IAuth): Observable<{ access_token: string; user: IUser }> {
    let url = `${environment.apiURL.RestAPI}/auth/login`;
    return this._httpClient.post<{ access_token: string; user: IUser }>(
      url,
      user
    );
  }

  public refreshToken(): Observable<string> {
    let url = `${environment.apiURL.RestAPI}/auth/refresh-token`;
    return this._httpClient
      .post<{ access_token: string }>(url, {})
      .pipe(map((res) => res.access_token));
  }

  public getCalls(offset: number, limit: number): Observable<any> {
    return new Observable();
  }
}
