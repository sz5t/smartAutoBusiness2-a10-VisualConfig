import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SmtDataTableWeekPickerComponent } from './smt-data-table-week-picker.component';

describe('SmtDataTableWeekPickerComponent', () => {
  let component: SmtDataTableWeekPickerComponent;
  let fixture: ComponentFixture<SmtDataTableWeekPickerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SmtDataTableWeekPickerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SmtDataTableWeekPickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
