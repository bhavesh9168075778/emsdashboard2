import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EnergymeterManagerComponent } from './energymeter-manager.component';

describe('EnergymeterManagerComponent', () => {
  let component: EnergymeterManagerComponent;
  let fixture: ComponentFixture<EnergymeterManagerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EnergymeterManagerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EnergymeterManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
