import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CnStaticFormArrayTableComponent } from './cn-static-form-array-table.component';

describe('CnStaticFormArrayTableComponent', () => {
  let component: CnStaticFormArrayTableComponent;
  let fixture: ComponentFixture<CnStaticFormArrayTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CnStaticFormArrayTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CnStaticFormArrayTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
