import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CnStaticFormCheckboxComponent } from './cn-static-form-checkbox.component';

describe('CnStaticFormCheckboxComponent', () => {
  let component: CnStaticFormCheckboxComponent;
  let fixture: ComponentFixture<CnStaticFormCheckboxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CnStaticFormCheckboxComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CnStaticFormCheckboxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
