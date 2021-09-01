import { Observable } from 'rxjs';
import { IAuth } from './auth.interface';
import { IUser } from './user.interface';

export interface IRequestProvider {
  auth: (user: IAuth) => Observable<{ access_token: string; user: IUser }>;
  refreshToken: () => Observable<string>;
}
