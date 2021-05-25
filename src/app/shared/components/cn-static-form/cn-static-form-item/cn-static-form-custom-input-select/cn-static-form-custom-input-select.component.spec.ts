import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CnStaticFormCustomInputSelectComponent } from './cn-static-form-custom-input-select.component';

describe('CnStaticFormCustomInputSelectComponent', () => {
  let component: CnStaticFormCustomInputSelectComponent;
  let fixture: ComponentFixture<CnStaticFormCustomInputSelectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CnStaticFormCustomInputSelectComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CnStaticFormCustomInputSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
