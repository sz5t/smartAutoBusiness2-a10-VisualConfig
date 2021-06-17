import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CnCfgFlowApprovalComponent } from './cn-cfg-flow-approval.component';

describe('CnCfgFlowApprovalComponent', () => {
  let component: CnCfgFlowApprovalComponent;
  let fixture: ComponentFixture<CnCfgFlowApprovalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CnCfgFlowApprovalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CnCfgFlowApprovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
