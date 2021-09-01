import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss'],
})
export class LoaderComponent implements OnInit {
  @Input('state') public isActive: boolean = false;

  constructor() {}

  ngOnInit(): void {
    console.log(this.isActive);
  }
}
