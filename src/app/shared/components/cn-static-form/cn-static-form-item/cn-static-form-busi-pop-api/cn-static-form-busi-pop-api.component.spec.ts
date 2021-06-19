import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CnStaticFormBusiPopApiComponent } from './cn-static-form-busi-pop-api.component';

describe('CnStaticFormBusiPopApiComponent', () => {
  let component: CnStaticFormBusiPopApiComponent;
  let fixture: ComponentFixture<CnStaticFormBusiPopApiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CnStaticFormBusiPopApiComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CnStaticFormBusiPopApiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
