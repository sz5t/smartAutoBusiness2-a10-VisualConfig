import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CnStaticFormArrayCardComponent } from './cn-static-form-array-card.component';

describe('CnStaticFormArrayCardComponent', () => {
  let component: CnStaticFormArrayCardComponent;
  let fixture: ComponentFixture<CnStaticFormArrayCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CnStaticFormArrayCardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CnStaticFormArrayCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
