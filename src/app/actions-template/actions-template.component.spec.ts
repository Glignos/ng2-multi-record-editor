import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActionsTemplateComponent } from './actions-template.component';

describe('ActionsTemplateComponent', () => {
  let component: ActionsTemplateComponent;
  let fixture: ComponentFixture<ActionsTemplateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActionsTemplateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActionsTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
