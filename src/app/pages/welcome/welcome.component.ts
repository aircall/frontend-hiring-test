import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { requestProviderType } from '@core/constants/request-provider.constants';
import { REQUEST_PROVIDER_TYPE } from '@core/models/request-provider.enum';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss'],
})
export class WelcomeComponent implements OnInit, OnDestroy {
  providerTypes: REQUEST_PROVIDER_TYPE[] = requestProviderType;
  selectedProvider: REQUEST_PROVIDER_TYPE = REQUEST_PROVIDER_TYPE.GraphQL;

  constructor(private _router: Router) {}

  ngOnInit(): void {
    console.log('TODO: preset privies selected provider');
  }

  ngOnDestroy(): void {
    console.log('TODO: save selected provider');
    console.log('TODO: init the provider by type');
  }

  public start(): void {
    this._router.navigate(['/login']);
  }
}
