import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CnFlowAttrSettingMoreComponent } from './cn-flow-attr-setting-more.component';

describe('CnFlowAttrSettingMoreComponent', () => {
  let component: CnFlowAttrSettingMoreComponent;
  let fixture: ComponentFixture<CnFlowAttrSettingMoreComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CnFlowAttrSettingMoreComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CnFlowAttrSettingMoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
