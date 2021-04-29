import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CfgLFormAttrCtrSizeComponent } from './cfg-l-form-attr-ctr-size.component';

describe('CfgLFormAttrCtrSizeComponent', () => {
  let component: CfgLFormAttrCtrSizeComponent;
  let fixture: ComponentFixture<CfgLFormAttrCtrSizeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CfgLFormAttrCtrSizeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CfgLFormAttrCtrSizeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
