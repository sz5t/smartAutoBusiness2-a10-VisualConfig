import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CnFlowAttrSettingComponent } from './cn-flow-attr-setting.component';

describe('CnFlowAttrSettingComponent', () => {
  let component: CnFlowAttrSettingComponent;
  let fixture: ComponentFixture<CnFlowAttrSettingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CnFlowAttrSettingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CnFlowAttrSettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
