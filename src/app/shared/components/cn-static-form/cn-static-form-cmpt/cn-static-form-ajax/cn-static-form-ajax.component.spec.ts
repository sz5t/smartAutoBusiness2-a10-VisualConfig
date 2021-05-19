import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CnStaticFormAjaxComponent } from './cn-static-form-ajax.component';

describe('CnStaticFormAjaxComponent', () => {
  let component: CnStaticFormAjaxComponent;
  let fixture: ComponentFixture<CnStaticFormAjaxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CnStaticFormAjaxComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CnStaticFormAjaxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
