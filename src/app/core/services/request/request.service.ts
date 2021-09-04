import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Apollo } from 'apollo-angular';

import { localStorageKeys } from '@core/constants/local-storage-keys.constant';
import { IAuth } from '@core/models/auth.interface';
import { REQUEST_PROVIDER_TYPE } from '@core/models/request-provider.enum';
import { IRequestProvider } from '@core/models/request-provider.interface';

import { GraphQLProvider } from './providers/graph-ql.provider';
import { RestAPIProvider } from './providers/rest-api.provider';
import { IUser } from '@core/models/user.interface';

@Injectable()
export class RequestService {
  private provider: IRequestProvider = new RestAPIProvider(this._http);

  constructor(private _http: HttpClient, private _apollo: Apollo) {
    let providerType = localStorage.getItem(localStorageKeys.providerType);

    if (providerType) {
      this.setProvider(providerType as REQUEST_PROVIDER_TYPE);
    }
  }

  public getCurrentProviderType(): REQUEST_PROVIDER_TYPE | undefined {
    return localStorage.getItem(
      localStorageKeys.providerType
    ) as REQUEST_PROVIDER_TYPE;
  }

  public setProvider(type: REQUEST_PROVIDER_TYPE): void {
    switch (type) {
      case REQUEST_PROVIDER_TYPE.GraphQL:
        this.provider = new GraphQLProvider(this._apollo);
        break;
      case REQUEST_PROVIDER_TYPE.RestAPI:
        this.provider = new RestAPIProvider(this._http);
        break;
    }
    localStorage.setItem(localStorageKeys.providerType, type);
  }

  public auth(user: IAuth): Observable<{ access_token: string; user: IUser }> {
    return this.provider.auth(user);
  }

  public refreshToken(): Observable<string> {
    return this.provider.refreshToken();
  }

  public getCalls(offset: number, limit: number): Observable<any> {
    return this.provider.getCalls(offset, limit);
  }

  public archiveCall(id: string): Observable<any> {
    return this.provider.archiveCall(id);
  }
}
