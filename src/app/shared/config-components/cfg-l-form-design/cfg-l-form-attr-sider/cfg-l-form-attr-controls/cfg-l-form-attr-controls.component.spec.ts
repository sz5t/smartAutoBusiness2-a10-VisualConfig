import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CfgLFormAttrControlsComponent } from './cfg-l-form-attr-controls.component';

describe('CfgLFormAttrControlsComponent', () => {
  let component: CfgLFormAttrControlsComponent;
  let fixture: ComponentFixture<CfgLFormAttrControlsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CfgLFormAttrControlsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CfgLFormAttrControlsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
