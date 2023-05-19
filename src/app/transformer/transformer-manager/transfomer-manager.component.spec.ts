import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TransfomerManagerComponent } from './transfomer-manager.component';

describe('TransfomerManagerComponent', () => {
  let component: TransfomerManagerComponent;
  let fixture: ComponentFixture<TransfomerManagerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TransfomerManagerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransfomerManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
