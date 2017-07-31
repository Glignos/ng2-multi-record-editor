import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdditionTemplateComponent } from './addition-template.component';

describe('AdditionTemplateComponent', () => {
  let component: AdditionTemplateComponent;
  let fixture: ComponentFixture<AdditionTemplateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdditionTemplateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdditionTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
