import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SmtFormTreeSelectComponent } from './smt-form-tree-select.component';

describe('SmtFormTreeSelectComponent', () => {
  let component: SmtFormTreeSelectComponent;
  let fixture: ComponentFixture<SmtFormTreeSelectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SmtFormTreeSelectComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SmtFormTreeSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
