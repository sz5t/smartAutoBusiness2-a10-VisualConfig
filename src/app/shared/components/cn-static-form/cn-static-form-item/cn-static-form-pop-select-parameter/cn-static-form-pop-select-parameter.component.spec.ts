import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CnStaticFormPopSelectParameterComponent } from './cn-static-form-pop-select-parameter.component';

describe('CnStaticFormPopSelectParameterComponent', () => {
  let component: CnStaticFormPopSelectParameterComponent;
  let fixture: ComponentFixture<CnStaticFormPopSelectParameterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CnStaticFormPopSelectParameterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CnStaticFormPopSelectParameterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
