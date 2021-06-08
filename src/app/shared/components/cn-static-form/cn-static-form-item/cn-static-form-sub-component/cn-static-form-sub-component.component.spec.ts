import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CnStaticFormSubComponentComponent } from './cn-static-form-sub-component.component';

describe('CnStaticFormSubComponentComponent', () => {
  let component: CnStaticFormSubComponentComponent;
  let fixture: ComponentFixture<CnStaticFormSubComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CnStaticFormSubComponentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CnStaticFormSubComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
