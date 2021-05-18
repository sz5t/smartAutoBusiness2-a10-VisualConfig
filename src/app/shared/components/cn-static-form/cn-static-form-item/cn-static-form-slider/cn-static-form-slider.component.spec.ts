import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CnStaticFormSliderComponent } from './cn-static-form-slider.component';

describe('CnStaticFormSliderComponent', () => {
  let component: CnStaticFormSliderComponent;
  let fixture: ComponentFixture<CnStaticFormSliderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CnStaticFormSliderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CnStaticFormSliderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
