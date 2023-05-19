import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OnlineofflinereportComponent } from './onlineofflinereport.component';

describe('OnlineofflinereportComponent', () => {
  let component: OnlineofflinereportComponent;
  let fixture: ComponentFixture<OnlineofflinereportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OnlineofflinereportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OnlineofflinereportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
