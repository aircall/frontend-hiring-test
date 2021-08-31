import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrivateWrapperComponent } from './private-wrapper.component';

describe('PrivateWrapperComponent', () => {
  let component: PrivateWrapperComponent;
  let fixture: ComponentFixture<PrivateWrapperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrivateWrapperComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrivateWrapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
