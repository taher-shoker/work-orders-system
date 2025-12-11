/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { HoldReasonComponent } from './hold-reason.component';

describe('HoldReasonComponent', () => {
  let component: HoldReasonComponent;
  let fixture: ComponentFixture<HoldReasonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HoldReasonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HoldReasonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
