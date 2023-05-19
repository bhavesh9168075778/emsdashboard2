import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddUpdateEnergymeterComponent } from './add-update-energymeter.component';

describe('AddUpdateEnergymeterComponent', () => {
  let component: AddUpdateEnergymeterComponent;
  let fixture: ComponentFixture<AddUpdateEnergymeterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddUpdateEnergymeterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddUpdateEnergymeterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
