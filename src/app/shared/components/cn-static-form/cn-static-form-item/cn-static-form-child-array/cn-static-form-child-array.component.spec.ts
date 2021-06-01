import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CnStaticFormChildArrayComponent } from './cn-static-form-child-array.component';

describe('CnStaticFormChildArrayComponent', () => {
  let component: CnStaticFormChildArrayComponent;
  let fixture: ComponentFixture<CnStaticFormChildArrayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CnStaticFormChildArrayComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CnStaticFormChildArrayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
