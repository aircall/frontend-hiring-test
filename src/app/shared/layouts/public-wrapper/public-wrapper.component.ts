import { Component, OnDestroy, OnInit } from '@angular/core';
import { NotificationService } from '@core/services/notification/notification.service';

import { routerAnimation } from '@shared/animation/router-animation';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-public-wrapper',
  templateUrl: './public-wrapper.component.html',
  styleUrls: ['./public-wrapper.component.scss'],
  animations: routerAnimation,
})
export class PublicWrapperComponent implements OnInit, OnDestroy {
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
