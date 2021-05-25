import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CnStaticFormGridItemComponent } from './cn-static-form-grid-item.component';

describe('CnStaticFormGridItemComponent', () => {
  let component: CnStaticFormGridItemComponent;
  let fixture: ComponentFixture<CnStaticFormGridItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CnStaticFormGridItemComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CnStaticFormGridItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
