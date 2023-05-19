import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OnlineofflineanalysisComponent } from './onlineofflineanalysis.component';

describe('OnlineofflineanalysisComponent', () => {
  let component: OnlineofflineanalysisComponent;
  let fixture: ComponentFixture<OnlineofflineanalysisComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OnlineofflineanalysisComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OnlineofflineanalysisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
