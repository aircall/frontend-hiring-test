import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CallsDetailsComponent } from './calls-details.component';

describe('CallsDetailsComponent', () => {
  let component: CallsDetailsComponent;
  let fixture: ComponentFixture<CallsDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CallsDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CallsDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
