import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SmtFormPickerMonthComponent } from './smt-form-picker-month.component';

describe('SmtFormPickerMonthComponent', () => {
  let component: SmtFormPickerMonthComponent;
  let fixture: ComponentFixture<SmtFormPickerMonthComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SmtFormPickerMonthComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SmtFormPickerMonthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
