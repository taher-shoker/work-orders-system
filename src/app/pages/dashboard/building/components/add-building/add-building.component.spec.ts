import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddBuildingComponent } from './add-building.component';

describe('AddBuildingComponent', () => {
  let component: AddBuildingComponent;
  let fixture: ComponentFixture<AddBuildingComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddBuildingComponent]
    });
    fixture = TestBed.createComponent(AddBuildingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
