import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CfgAttributeValidationComponent } from './cfg-attribute-validation.component';

describe('CfgAttributeValidationComponent', () => {
  let component: CfgAttributeValidationComponent;
  let fixture: ComponentFixture<CfgAttributeValidationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CfgAttributeValidationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CfgAttributeValidationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
