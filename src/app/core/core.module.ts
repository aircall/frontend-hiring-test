import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { APOLLO_NAMED_OPTIONS, NamedOptions } from 'apollo-angular';
import { HttpLink } from 'apollo-angular/http';
import { InMemoryCache } from '@apollo/client/core';

import { AuthService } from './services/auth/auth.service';
import { RequestService } from './services/request/request.service';
import { environment } from 'src/environments/environment';
import { AuthGuard } from './guards/auth.guard';
import { CallsService } from './services/calls/calls.service';

@NgModule({
  imports: [HttpClientModule],

  providers: [
    AuthService,
    RequestService,
    AuthGuard,
    CallsService,
    {
      provide: APOLLO_NAMED_OPTIONS, // <-- Different from standard initialization
      useFactory(httpLink: HttpLink): NamedOptions {
        return {
          aircall_client: {
            cache: new InMemoryCache(),
            link: httpLink.create({
              uri: environment.apiURL.GraphQL,
            }),
          },
        };
      },
      deps: [HttpLink],
    },
  ],
})
export class CoreModule {}
