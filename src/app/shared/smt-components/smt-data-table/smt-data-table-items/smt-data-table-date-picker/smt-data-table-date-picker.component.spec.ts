import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SmtDataTableDatePickerComponent } from './smt-data-table-date-picker.component';

describe('SmtDataTableDatePickerComponent', () => {
  let component: SmtDataTableDatePickerComponent;
  let fixture: ComponentFixture<SmtDataTableDatePickerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SmtDataTableDatePickerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SmtDataTableDatePickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
