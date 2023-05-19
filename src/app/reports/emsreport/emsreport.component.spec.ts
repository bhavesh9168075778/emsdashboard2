import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmsreportComponent } from './emsreport.component';

describe('EmsreportComponent', () => {
  let component: EmsreportComponent;
  let fixture: ComponentFixture<EmsreportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmsreportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmsreportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
