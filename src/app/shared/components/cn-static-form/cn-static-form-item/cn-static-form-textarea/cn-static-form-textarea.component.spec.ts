import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CnStaticFormTextareaComponent } from './cn-static-form-textarea.component';

describe('CnStaticFormTextareaComponent', () => {
  let component: CnStaticFormTextareaComponent;
  let fixture: ComponentFixture<CnStaticFormTextareaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CnStaticFormTextareaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CnStaticFormTextareaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
