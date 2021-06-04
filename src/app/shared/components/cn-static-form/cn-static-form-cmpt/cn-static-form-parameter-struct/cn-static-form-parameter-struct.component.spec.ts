import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CnStaticFormParameterStructComponent } from './cn-static-form-parameter-struct.component';

describe('CnStaticFormParameterStructComponent', () => {
  let component: CnStaticFormParameterStructComponent;
  let fixture: ComponentFixture<CnStaticFormParameterStructComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CnStaticFormParameterStructComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CnStaticFormParameterStructComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
