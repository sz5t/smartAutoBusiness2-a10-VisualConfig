import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CnStaticFormApiComponent } from './cn-static-form-api.component';

describe('CnStaticFormApiComponent', () => {
  let component: CnStaticFormApiComponent;
  let fixture: ComponentFixture<CnStaticFormApiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CnStaticFormApiComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CnStaticFormApiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
