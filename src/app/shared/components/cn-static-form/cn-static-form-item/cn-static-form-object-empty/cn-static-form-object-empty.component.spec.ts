import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CnStaticFormObjectEmptyComponent } from './cn-static-form-object-empty.component';

describe('CnStaticFormObjectEmptyComponent', () => {
  let component: CnStaticFormObjectEmptyComponent;
  let fixture: ComponentFixture<CnStaticFormObjectEmptyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CnStaticFormObjectEmptyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CnStaticFormObjectEmptyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
