import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CnStaticFormSwitchComponent } from './cn-static-form-switch.component';

describe('CnStaticFormSwitchComponent', () => {
  let component: CnStaticFormSwitchComponent;
  let fixture: ComponentFixture<CnStaticFormSwitchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CnStaticFormSwitchComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CnStaticFormSwitchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
