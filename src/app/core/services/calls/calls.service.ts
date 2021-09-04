import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { RequestService } from '../request/request.service';
import { CallDetailsModel } from '@core/models/call-details.model';

@Injectable()
export class CallsService {
  constructor(private _requestService: RequestService) {}

  public getCalls(offset: number, limit: number): Observable<any> {
    return this._requestService.getCalls(offset, limit);
  }

  public archiveCall(id: string): Observable<any> {
    return this._requestService.archiveCall(id);
  }

  public getCallById(id: string = ''): Observable<CallDetailsModel> {
    return this._requestService.getCallById(id);
  }
}
