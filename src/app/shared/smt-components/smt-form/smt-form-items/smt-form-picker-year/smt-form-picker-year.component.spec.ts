import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SmtFormPickerYearComponent } from './smt-form-picker-year.component';

describe('SmtFormPickerYearComponent', () => {
  let component: SmtFormPickerYearComponent;
  let fixture: ComponentFixture<SmtFormPickerYearComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SmtFormPickerYearComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SmtFormPickerYearComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
