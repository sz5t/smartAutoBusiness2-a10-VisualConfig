import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CnStaticFormInputComponent } from './cn-static-form-input.component';

describe('CnStaticFormInputComponent', () => {
  let component: CnStaticFormInputComponent;
  let fixture: ComponentFixture<CnStaticFormInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CnStaticFormInputComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CnStaticFormInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
