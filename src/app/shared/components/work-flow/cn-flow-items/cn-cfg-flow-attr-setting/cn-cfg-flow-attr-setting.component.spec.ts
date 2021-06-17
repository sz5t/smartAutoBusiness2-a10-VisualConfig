import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CnCfgFlowAttrSettingComponent } from './cn-cfg-flow-attr-setting.component';

describe('CnCfgFlowAttrSettingComponent', () => {
  let component: CnCfgFlowAttrSettingComponent;
  let fixture: ComponentFixture<CnCfgFlowAttrSettingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CnCfgFlowAttrSettingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CnCfgFlowAttrSettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
