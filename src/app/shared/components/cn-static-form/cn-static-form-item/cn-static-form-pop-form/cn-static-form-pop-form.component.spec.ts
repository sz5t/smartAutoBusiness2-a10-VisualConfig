import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CnStaticFormPopFormComponent } from './cn-static-form-pop-form.component';

describe('CnStaticFormPopFormComponent', () => {
  let component: CnStaticFormPopFormComponent;
  let fixture: ComponentFixture<CnStaticFormPopFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CnStaticFormPopFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CnStaticFormPopFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
