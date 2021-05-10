import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CfgLFormAttrPropertyTypeComponent } from './cfg-l-form-attr-property-type.component';

describe('CfgLFormAttrPropertyTypeComponent', () => {
  let component: CfgLFormAttrPropertyTypeComponent;
  let fixture: ComponentFixture<CfgLFormAttrPropertyTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CfgLFormAttrPropertyTypeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CfgLFormAttrPropertyTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
