import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmsIndividualDashboardComponent } from './ems-individual-dashboard.component';

describe('EmsIndividualDashboardComponent', () => {
  let component: EmsIndividualDashboardComponent;
  let fixture: ComponentFixture<EmsIndividualDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmsIndividualDashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmsIndividualDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
