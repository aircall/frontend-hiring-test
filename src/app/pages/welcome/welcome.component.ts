import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { requestProviderType } from '@core/constants/request-provider.constants';
import { REQUEST_PROVIDER_TYPE } from '@core/models/request-provider.enum';
import { RequestService } from '@core/services/request/request.service';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss'],
  host: {
    class: 'h-100',
  },
})
export class WelcomeComponent implements OnInit, OnDestroy {
  public providerTypes: REQUEST_PROVIDER_TYPE[] = requestProviderType;
  public selectedProvider: REQUEST_PROVIDER_TYPE =
    REQUEST_PROVIDER_TYPE.GraphQL;

  constructor(
    private _router: Router,
    private _requestService: RequestService
  ) {}

  ngOnInit(): void {
    this.selectedProvider =
      this._requestService.getCurrentProviderType() ||
      REQUEST_PROVIDER_TYPE.GraphQL;
  }

  ngOnDestroy(): void {
    this._requestService.setProvider(this.selectedProvider);
  }

  public start(): void {
    this._requestService.setProvider(this.selectedProvider);
    this._router.navigate(['/login']);
  }
}
