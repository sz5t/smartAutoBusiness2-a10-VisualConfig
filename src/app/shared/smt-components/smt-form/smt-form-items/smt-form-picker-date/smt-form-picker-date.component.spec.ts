import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SmtFormPickerDateComponent } from './smt-form-picker-date.component';

describe('SmtFormPickerDateComponent', () => {
  let component: SmtFormPickerDateComponent;
  let fixture: ComponentFixture<SmtFormPickerDateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SmtFormPickerDateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SmtFormPickerDateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
