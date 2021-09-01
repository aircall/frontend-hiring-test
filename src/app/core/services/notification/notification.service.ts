import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable()
export class NotificationService {
  private loadingSubject: Subject<boolean> = new Subject();
  public $loading: Observable<boolean> = this.loadingSubject.asObservable();

  constructor() {}

  public setLoader(): void {
    this.loadingSubject.next(true);
  }

  public clearLoading(): void {
    this.loadingSubject.next(false);
  }
}
