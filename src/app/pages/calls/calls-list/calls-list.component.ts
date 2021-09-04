import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { forkJoin, Observable } from 'rxjs';

import { callTypes } from '@core/constants/call-types.constant';
import { CALL_TYPE } from '@core/models/call-type.enum';
import { CallModel } from '@core/models/call.model';
import { CallsService } from '@core/services/calls/calls.service';
import { NotificationService } from '@core/services/notification/notification.service';

@Component({
  selector: 'app-calls-list',
  templateUrl: './calls-list.component.html',
  styleUrls: ['./calls-list.component.scss'],
})
export class CallsListComponent implements OnInit {
  public calls: CallModel[] = [];
  public offset: number = 0;
  public callDirectionIcon = {
    inbound: { icon: 'call_received', color: 'primary' },
    outbound: { icon: 'call_made', color: 'accent' },
  };
  public callTypes = callTypes;
  public selectedCallType: CALL_TYPE | null = null;
  public hasNextPage: boolean = true;
  public isEditMode: boolean = false;
  public selectedCalls: any = {};

  private _limit: number = 30;

  constructor(
    private _callsService: CallsService,
    private _notificationService: NotificationService,
    private _router: Router
  ) {}

  ngOnInit(): void {
    this._requestToCalls();
  }

  public viewDetails(id: string): void {
    this._router.navigate(['/private/calls/details', id]);
  }

  public loadMore(): void {
    this.offset += this._limit;
    this._requestToCalls();
  }

  public changeEditMode(): void {
    this.isEditMode = !this.isEditMode;
  }

  public editCallback(isConfirmed: boolean): void {
    let callsId = Object.keys(this.selectedCalls);
    if (isConfirmed) {
      this._notificationService.setLoader();
      let observables: Observable<{ id: string }>[] = callsId
        .filter((key) => this.selectedCalls[key])
        .map((key) => this._callsService.archiveCall(key));

      forkJoin(observables).subscribe((res) => {
        this.offset = 0;
        this.calls = [];
        this._requestToCalls();
      });
    }
    this.isEditMode = false;
    callsId.forEach((key) => {
      this.selectedCalls[key] = false;
    });
  }

  private _requestToCalls(): void {
    this._notificationService.setLoader();
    this._callsService.getCalls(this.offset, this._limit).subscribe((res) => {
      res.calls.forEach((el: CallModel) => {
        this.selectedCalls[el.id] = false;
      });
      this.calls = [...this.calls, ...res.calls];
      this.hasNextPage = res.hasNextPage;
      this._notificationService.clearLoading();
    });
  }
}
