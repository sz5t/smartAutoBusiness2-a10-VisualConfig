import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CfgLFormAttrCtrBaseComponent } from './cfg-l-form-attr-ctr-base.component';

describe('CfgLFormAttrCtrBaseComponent', () => {
  let component: CfgLFormAttrCtrBaseComponent;
  let fixture: ComponentFixture<CfgLFormAttrCtrBaseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CfgLFormAttrCtrBaseComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CfgLFormAttrCtrBaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
