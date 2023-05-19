import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HvlvdiffreportComponent } from './hvlvdiffreport.component';

describe('HvlvdiffreportComponent', () => {
  let component: HvlvdiffreportComponent;
  let fixture: ComponentFixture<HvlvdiffreportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HvlvdiffreportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HvlvdiffreportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
