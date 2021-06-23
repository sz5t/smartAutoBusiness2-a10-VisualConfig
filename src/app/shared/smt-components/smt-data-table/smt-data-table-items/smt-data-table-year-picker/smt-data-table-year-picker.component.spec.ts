import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SmtDataTableYearPickerComponent } from './smt-data-table-year-picker.component';

describe('SmtDataTableYearPickerComponent', () => {
  let component: SmtDataTableYearPickerComponent;
  let fixture: ComponentFixture<SmtDataTableYearPickerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SmtDataTableYearPickerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SmtDataTableYearPickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
