import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CnStaticFormArrayCollapseComponent } from './cn-static-form-array-collapse.component';

describe('CnStaticFormArrayCollapseComponent', () => {
  let component: CnStaticFormArrayCollapseComponent;
  let fixture: ComponentFixture<CnStaticFormArrayCollapseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CnStaticFormArrayCollapseComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CnStaticFormArrayCollapseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
