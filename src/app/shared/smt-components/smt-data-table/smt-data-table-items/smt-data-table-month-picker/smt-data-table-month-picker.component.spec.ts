import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SmtDataTableMonthPickerComponent } from './smt-data-table-month-picker.component';

describe('SmtDataTableMonthPickerComponent', () => {
  let component: SmtDataTableMonthPickerComponent;
  let fixture: ComponentFixture<SmtDataTableMonthPickerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SmtDataTableMonthPickerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SmtDataTableMonthPickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
