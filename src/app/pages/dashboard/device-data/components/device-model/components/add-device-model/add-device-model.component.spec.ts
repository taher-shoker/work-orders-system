import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddDeviceModelComponent } from './add-device-model.component';

describe('AddDeviceModelComponent', () => {
  let component: AddDeviceModelComponent;
  let fixture: ComponentFixture<AddDeviceModelComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddDeviceModelComponent]
    });
    fixture = TestBed.createComponent(AddDeviceModelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
