import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CnStaticFormTagComponent } from './cn-static-form-tag.component';

describe('CnStaticFormTagComponent', () => {
  let component: CnStaticFormTagComponent;
  let fixture: ComponentFixture<CnStaticFormTagComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CnStaticFormTagComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CnStaticFormTagComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
