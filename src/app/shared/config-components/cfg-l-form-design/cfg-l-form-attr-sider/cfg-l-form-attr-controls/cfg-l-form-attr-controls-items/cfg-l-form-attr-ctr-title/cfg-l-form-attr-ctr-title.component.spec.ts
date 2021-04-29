import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CfgLFormAttrCtrTitleComponent } from './cfg-l-form-attr-ctr-title.component';

describe('CfgLFormAttrCtrTitleComponent', () => {
  let component: CfgLFormAttrCtrTitleComponent;
  let fixture: ComponentFixture<CfgLFormAttrCtrTitleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CfgLFormAttrCtrTitleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CfgLFormAttrCtrTitleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
