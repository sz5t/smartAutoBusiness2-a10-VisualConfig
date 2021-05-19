import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CnStaticFormCheckComponent } from './cn-static-form-check.component';

describe('CnStaticFormCheckComponent', () => {
  let component: CnStaticFormCheckComponent;
  let fixture: ComponentFixture<CnStaticFormCheckComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CnStaticFormCheckComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CnStaticFormCheckComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
