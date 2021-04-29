import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CfgLFormAttrStyleColComponent } from './cfg-l-form-attr-style-col.component';

describe('CfgLFormAttrStyleColComponent', () => {
  let component: CfgLFormAttrStyleColComponent;
  let fixture: ComponentFixture<CfgLFormAttrStyleColComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CfgLFormAttrStyleColComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CfgLFormAttrStyleColComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
