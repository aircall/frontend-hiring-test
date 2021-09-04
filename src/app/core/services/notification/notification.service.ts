import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable()
export class NotificationService {
  private loadingSubject: Subject<boolean> = new Subject();
  public $loading: Observable<boolean> = this.loadingSubject.asObservable();

  constructor(private _snackBar: MatSnackBar) {}

  public setLoader(): void {
    this.loadingSubject.next(true);
  }

  public clearLoading(): void {
    this.loadingSubject.next(false);
  }

  public showSnackMessage(message: string): void {
    this._snackBar.open(message, undefined, {
      duration: 5000,
      verticalPosition: 'bottom',
      horizontalPosition: 'center',
    });
  }
}
