import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SmtFormPickerRangeComponent } from './smt-form-picker-range.component';

describe('SmtFormPickerRangeComponent', () => {
  let component: SmtFormPickerRangeComponent;
  let fixture: ComponentFixture<SmtFormPickerRangeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SmtFormPickerRangeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SmtFormPickerRangeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
