import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddTransformerComponent } from './add-transformer.component';

describe('AddTransformerComponent', () => {
  let component: AddTransformerComponent;
  let fixture: ComponentFixture<AddTransformerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddTransformerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddTransformerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
