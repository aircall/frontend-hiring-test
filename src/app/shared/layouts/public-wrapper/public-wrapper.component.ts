import { Component, OnInit } from '@angular/core';

import { routerAnimation } from '@shared/animation/router-animation';

@Component({
  selector: 'app-public-wrapper',
  templateUrl: './public-wrapper.component.html',
  styleUrls: ['./public-wrapper.component.scss'],
  animations: routerAnimation,
})
export class PublicWrapperComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}

  public getDepth(outlet: any): string {
    return outlet.activatedRouteData['depth'];
  }
}
