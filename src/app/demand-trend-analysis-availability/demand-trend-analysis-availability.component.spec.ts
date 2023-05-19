import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DemandTrendAnalysisAvailabilityComponent } from './demand-trend-analysis-availability.component';

describe('DemandTrendAnalysisAvailabilityComponent', () => {
  let component: DemandTrendAnalysisAvailabilityComponent;
  let fixture: ComponentFixture<DemandTrendAnalysisAvailabilityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DemandTrendAnalysisAvailabilityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DemandTrendAnalysisAvailabilityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
