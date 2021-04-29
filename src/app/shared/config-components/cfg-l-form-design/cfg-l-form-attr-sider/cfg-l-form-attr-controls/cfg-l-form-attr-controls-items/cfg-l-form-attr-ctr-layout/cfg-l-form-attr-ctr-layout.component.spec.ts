import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CfgLFormAttrCtrLayoutComponent } from './cfg-l-form-attr-ctr-layout.component';

describe('CfgLFormAttrCtrLayoutComponent', () => {
  let component: CfgLFormAttrCtrLayoutComponent;
  let fixture: ComponentFixture<CfgLFormAttrCtrLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CfgLFormAttrCtrLayoutComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CfgLFormAttrCtrLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
