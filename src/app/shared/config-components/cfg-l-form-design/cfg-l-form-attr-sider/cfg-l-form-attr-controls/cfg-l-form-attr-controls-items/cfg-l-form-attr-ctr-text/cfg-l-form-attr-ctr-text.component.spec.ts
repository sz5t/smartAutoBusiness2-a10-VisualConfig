import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CfgLFormAttrCtrTextComponent } from './cfg-l-form-attr-ctr-text.component';

describe('CfgLFormAttrCtrTextComponent', () => {
  let component: CfgLFormAttrCtrTextComponent;
  let fixture: ComponentFixture<CfgLFormAttrCtrTextComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CfgLFormAttrCtrTextComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CfgLFormAttrCtrTextComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
