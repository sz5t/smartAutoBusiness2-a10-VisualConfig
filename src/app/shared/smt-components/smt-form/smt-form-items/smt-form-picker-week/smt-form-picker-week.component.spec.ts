import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SmtFormPickerWeekComponent } from './smt-form-picker-week.component';

describe('SmtFormPickerWeekComponent', () => {
  let component: SmtFormPickerWeekComponent;
  let fixture: ComponentFixture<SmtFormPickerWeekComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SmtFormPickerWeekComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SmtFormPickerWeekComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
