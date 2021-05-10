import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CnStaticFormComponent } from './cn-static-form.component';

describe('CnStaticFormComponent', () => {
  let component: CnStaticFormComponent;
  let fixture: ComponentFixture<CnStaticFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CnStaticFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CnStaticFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
