import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditSiteManagerComponent } from './add-edit-site-manager.component';

describe('AddEditSiteManagerComponent', () => {
  let component: AddEditSiteManagerComponent;
  let fixture: ComponentFixture<AddEditSiteManagerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddEditSiteManagerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEditSiteManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
