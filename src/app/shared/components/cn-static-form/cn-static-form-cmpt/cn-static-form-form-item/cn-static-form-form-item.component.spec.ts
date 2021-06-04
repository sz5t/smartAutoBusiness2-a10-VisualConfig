import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CnStaticFormFormItemComponent } from './cn-static-form-form-item.component';

describe('CnStaticFormFormItemComponent', () => {
  let component: CnStaticFormFormItemComponent;
  let fixture: ComponentFixture<CnStaticFormFormItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CnStaticFormFormItemComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CnStaticFormFormItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
