import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CnStaticFormSwitchConentComponent } from './cn-static-form-switch-conent.component';

describe('CnStaticFormSwitchConentComponent', () => {
  let component: CnStaticFormSwitchConentComponent;
  let fixture: ComponentFixture<CnStaticFormSwitchConentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CnStaticFormSwitchConentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CnStaticFormSwitchConentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
