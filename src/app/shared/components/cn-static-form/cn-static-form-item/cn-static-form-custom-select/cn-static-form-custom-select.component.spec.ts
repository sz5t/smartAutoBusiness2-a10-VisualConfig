import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CnStaticFormCustomSelectComponent } from './cn-static-form-custom-select.component';

describe('CnStaticFormCustomSelectComponent', () => {
  let component: CnStaticFormCustomSelectComponent;
  let fixture: ComponentFixture<CnStaticFormCustomSelectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CnStaticFormCustomSelectComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CnStaticFormCustomSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
