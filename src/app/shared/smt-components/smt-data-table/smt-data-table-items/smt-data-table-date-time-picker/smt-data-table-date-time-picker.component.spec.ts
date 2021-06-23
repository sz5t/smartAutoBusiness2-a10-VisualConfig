import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SmtDataTableDateTimePickerComponent } from './smt-data-table-date-time-picker.component';

describe('SmtDataTableDateTimePickerComponent', () => {
  let component: SmtDataTableDateTimePickerComponent;
  let fixture: ComponentFixture<SmtDataTableDateTimePickerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SmtDataTableDateTimePickerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SmtDataTableDateTimePickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
