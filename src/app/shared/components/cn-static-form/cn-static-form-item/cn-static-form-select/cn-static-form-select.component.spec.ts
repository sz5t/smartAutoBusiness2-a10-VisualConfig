import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CnStaticFormSelectComponent } from './cn-static-form-select.component';

describe('CnStaticFormSelectComponent', () => {
  let component: CnStaticFormSelectComponent;
  let fixture: ComponentFixture<CnStaticFormSelectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CnStaticFormSelectComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CnStaticFormSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
