import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CnStaticFormStaticFormComponent } from './cn-static-form-static-form.component';

describe('CnStaticFormStaticFormComponent', () => {
  let component: CnStaticFormStaticFormComponent;
  let fixture: ComponentFixture<CnStaticFormStaticFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CnStaticFormStaticFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CnStaticFormStaticFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
