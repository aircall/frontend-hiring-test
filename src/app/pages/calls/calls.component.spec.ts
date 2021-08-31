import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CallsComponent } from './calls.component';

describe('CallsComponent', () => {
  let component: CallsComponent;
  let fixture: ComponentFixture<CallsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CallsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CallsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
