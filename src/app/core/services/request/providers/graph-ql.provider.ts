import { Apollo, ApolloBase, gql } from 'apollo-angular';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { IAuth } from '@core/models/auth.interface';
import { IRequestProvider } from '@core/models/request-provider.interface';
import { IUser } from '@core/models/user.interface';
import { CallModel } from '@core/models/call.model';

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
    const query = `
    mutation {
      refreshToken {
        access_token
      }
    }
    `;

    return this._apollo
      .mutate<{ refreshToken: { access_token: string } }>({
        mutation: gql`
          ${query}
        `,
      })
      .pipe(map((res) => res.data?.refreshToken.access_token || ''));
  }

  public getCalls(
    offset: number,
    limit: number
  ): Observable<{ calls: CallModel[]; hasNextPage: boolean }> {
    const query = `{
      paginatedCalls(offset:${offset}, limit: ${limit}) {
        nodes {
          id,
          direction,
          from,
          to,
          is_archived,
          call_type,
          created_at
        },
        hasNextPage,
      }
    }`;
    return this._apollo
      .query<{ paginatedCalls: { nodes: CallModel[]; hasNextPage: boolean } }>({
        query: gql`
          ${query}
        `,
      })
      .pipe(
        map((res) => ({
          calls: res.data.paginatedCalls.nodes,
          hasNextPage: res.data.paginatedCalls.hasNextPage,
        }))
      );
  }

  public archiveCall(id: string): Observable<{ id: string }> {
    const query = `
    mutation {
      archiveCall(id: "${id}") {
        id
      }
    }
    `;
    return this._apollo
      .mutate<{
        archiveCall: {
          id: string;
        };
      }>({
        mutation: gql`
          ${query}
        `,
      })
      .pipe(map((res) => res.data?.archiveCall || { id: '' }));
  }
}
