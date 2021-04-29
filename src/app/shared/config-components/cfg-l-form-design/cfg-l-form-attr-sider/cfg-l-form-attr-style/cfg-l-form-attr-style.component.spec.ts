import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CfgLFormAttrStyleComponent } from './cfg-l-form-attr-style.component';

describe('CfgLFormAttrStyleComponent', () => {
  let component: CfgLFormAttrStyleComponent;
  let fixture: ComponentFixture<CfgLFormAttrStyleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CfgLFormAttrStyleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CfgLFormAttrStyleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
