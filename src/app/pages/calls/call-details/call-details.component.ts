import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { CallsService } from '@core/services/calls/calls.service';
import { CallDetailsModel } from '@core/models/call-details.model';
import { NotificationService } from '@core/services/notification/notification.service';

@Component({
  selector: 'app-call-details',
  templateUrl: './call-details.component.html',
  styleUrls: ['./call-details.component.scss'],
})
export class CallDetailsComponent implements OnInit {
  public currentCallId?: string;
  public callDetails?: CallDetailsModel;
  public callDirectionIcon = {
    inbound: { icon: 'arrow_downward', color: 'primary' },
    outbound: { icon: 'arrow_upward', color: 'accent' },
  };

  constructor(
    private _activatedRoute: ActivatedRoute,
    private _callsService: CallsService,
    private _location: Location,
    private _notificationService: NotificationService
  ) {
    this._activatedRoute.params.subscribe(
      (param) => (this.currentCallId = param.id)
    );
  }

  ngOnInit(): void {
    this.requestToCall();
  }

  public goBack(): void {
    this._location.back();
  }

  public editCall(): void {
    this._notificationService.setLoader();
    this._callsService.archiveCall(this.currentCallId || '').subscribe(
      (_) => {
        this.requestToCall();
      },
      (_) => {
        this._notificationService.clearLoading();
        this._notificationService.showSnackMessage(
          'Hmm... Something has gone wrong'
        );
      }
    );
  }
  private requestToCall(): void {
    this._notificationService.setLoader();
    this._callsService.getCallById(this.currentCallId).subscribe(
      (call) => {
        this.callDetails = call;
        this._notificationService.clearLoading();
      },
      (_) => {
        this._notificationService.clearLoading();
        this._notificationService.showSnackMessage(
          'Hmm... Something has gone wrong'
        );
      }
    );
  }
}
