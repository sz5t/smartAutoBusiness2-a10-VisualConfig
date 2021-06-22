import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SmtDataTableRangePickerComponent } from './smt-data-table-range-picker.component';

describe('SmtDataTableRangePickerComponent', () => {
  let component: SmtDataTableRangePickerComponent;
  let fixture: ComponentFixture<SmtDataTableRangePickerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SmtDataTableRangePickerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SmtDataTableRangePickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
