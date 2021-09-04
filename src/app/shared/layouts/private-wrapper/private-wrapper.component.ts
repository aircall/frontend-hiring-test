import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { NotificationService } from '@core/services/notification/notification.service';
import { routerAnimation } from '@shared/animation/router-animation';

@Component({
  selector: 'app-private-wrapper',
  templateUrl: './private-wrapper.component.html',
  styleUrls: ['./private-wrapper.component.scss'],
  animations: [routerAnimation],
})
export class PrivateWrapperComponent implements OnInit, OnDestroy {
  public isLoaderActive: boolean = false;
  private subscriber: Subscription = new Subscription();
  constructor(private _notificationService: NotificationService) {}

  ngOnInit(): void {
    this.subscriber = this._notificationService.$loading.subscribe(
      (state) => (this.isLoaderActive = state)
    );
  }

  ngOnDestroy(): void {
    this.subscriber.unsubscribe();
  }

  public getDepth(outlet: any): string {
    return outlet.activatedRouteData['depth'];
  }
}
