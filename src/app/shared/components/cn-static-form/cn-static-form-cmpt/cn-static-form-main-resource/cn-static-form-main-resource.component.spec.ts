import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CnStaticFormMainResourceComponent } from './cn-static-form-main-resource.component';

describe('CnStaticFormMainResourceComponent', () => {
  let component: CnStaticFormMainResourceComponent;
  let fixture: ComponentFixture<CnStaticFormMainResourceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CnStaticFormMainResourceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CnStaticFormMainResourceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
