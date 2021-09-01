import { Apollo, ApolloBase, gql } from 'apollo-angular';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { IAuth } from '@core/models/auth.interface';
import { IRequestProvider } from '@core/models/request-provider.interface';
import { IUser } from '@core/models/user.interface';

export class GraphQLProvider implements IRequestProvider {
  private _apollo: ApolloBase;

  constructor(private _client: Apollo) {
    this._apollo = this._client.use('aircall_client');
  }

  public auth(user: IAuth): Observable<{ access_token: string; user: IUser }> {
    const query = `
      mutation {
        login(input: {username:"${user.username}", password:"${user.password}"}) {
          access_token
          user {
            id
            username
          }
        }
      }
    `;
    return this._apollo
      .mutate<{ login: { access_token: string; user: IUser } }>({
        mutation: gql`
          ${query}
        `,
      })
      .pipe(
        map(
          (res) =>
            res.data?.login || {
              access_token: '',
              user: { id: '', username: '' },
            }
        )
      );
  }

  public refreshToken(): Observable<string> {
    return new Observable();
  }
}
