import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CfgLFormAttrPopBaseComponent } from './cfg-l-form-attr-pop-base.component';

describe('CfgLFormAttrPopBaseComponent', () => {
  let component: CfgLFormAttrPopBaseComponent;
  let fixture: ComponentFixture<CfgLFormAttrPopBaseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CfgLFormAttrPopBaseComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CfgLFormAttrPopBaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
