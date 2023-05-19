import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmstreeComponent } from './emstree.component';

describe('EmstreeComponent', () => {
  let component: EmstreeComponent;
  let fixture: ComponentFixture<EmstreeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmstreeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmstreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
