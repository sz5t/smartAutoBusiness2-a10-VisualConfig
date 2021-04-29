import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CfgAttributeFormStateComponent } from './cfg-attribute-form-state.component';

describe('CfgAttributeFormStateComponent', () => {
  let component: CfgAttributeFormStateComponent;
  let fixture: ComponentFixture<CfgAttributeFormStateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CfgAttributeFormStateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CfgAttributeFormStateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
