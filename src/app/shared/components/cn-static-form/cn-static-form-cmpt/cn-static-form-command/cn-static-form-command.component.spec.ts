import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CnStaticFormCommandComponent } from './cn-static-form-command.component';

describe('CnStaticFormCommandComponent', () => {
  let component: CnStaticFormCommandComponent;
  let fixture: ComponentFixture<CnStaticFormCommandComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CnStaticFormCommandComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CnStaticFormCommandComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
