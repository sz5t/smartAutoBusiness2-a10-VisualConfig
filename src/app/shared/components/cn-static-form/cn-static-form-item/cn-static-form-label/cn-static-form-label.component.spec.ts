import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CnStaticFormLabelComponent } from './cn-static-form-label.component';

describe('CnStaticFormLabelComponent', () => {
  let component: CnStaticFormLabelComponent;
  let fixture: ComponentFixture<CnStaticFormLabelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CnStaticFormLabelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CnStaticFormLabelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
