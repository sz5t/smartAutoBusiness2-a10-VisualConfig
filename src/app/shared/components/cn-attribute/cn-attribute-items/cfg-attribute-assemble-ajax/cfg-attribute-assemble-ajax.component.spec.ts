import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CfgAttributeAssembleAjaxComponent } from './cfg-attribute-assemble-ajax.component';

describe('CfgAttributeAssembleAjaxComponent', () => {
  let component: CfgAttributeAssembleAjaxComponent;
  let fixture: ComponentFixture<CfgAttributeAssembleAjaxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CfgAttributeAssembleAjaxComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CfgAttributeAssembleAjaxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
