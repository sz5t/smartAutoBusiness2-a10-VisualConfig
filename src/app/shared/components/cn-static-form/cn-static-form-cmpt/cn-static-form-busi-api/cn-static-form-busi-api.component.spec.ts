import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CnStaticFormBusiApiComponent } from './cn-static-form-busi-api.component';

describe('CnStaticFormBusiApiComponent', () => {
  let component: CnStaticFormBusiApiComponent;
  let fixture: ComponentFixture<CnStaticFormBusiApiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CnStaticFormBusiApiComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CnStaticFormBusiApiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
