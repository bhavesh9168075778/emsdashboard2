import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DemandTrendAnalysisComponent } from './demand-trend-analysis.component';

describe('DemandTrendAnalysisComponent', () => {
  let component: DemandTrendAnalysisComponent;
  let fixture: ComponentFixture<DemandTrendAnalysisComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DemandTrendAnalysisComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DemandTrendAnalysisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
