import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CnCfgFlowApprovalHandleComponent } from './cn-cfg-flow-approval-handle.component';

describe('CnCfgFlowApprovalHandleComponent', () => {
  let component: CnCfgFlowApprovalHandleComponent;
  let fixture: ComponentFixture<CnCfgFlowApprovalHandleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CnCfgFlowApprovalHandleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CnCfgFlowApprovalHandleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
