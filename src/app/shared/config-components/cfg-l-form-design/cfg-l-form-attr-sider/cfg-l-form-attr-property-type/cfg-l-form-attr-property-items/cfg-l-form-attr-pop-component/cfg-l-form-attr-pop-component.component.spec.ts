import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CfgLFormAttrPopComponentComponent } from './cfg-l-form-attr-pop-component.component';

describe('CfgLFormAttrPopComponentComponent', () => {
  let component: CfgLFormAttrPopComponentComponent;
  let fixture: ComponentFixture<CfgLFormAttrPopComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CfgLFormAttrPopComponentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CfgLFormAttrPopComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
