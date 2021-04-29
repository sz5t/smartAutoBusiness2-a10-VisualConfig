import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CnFlowApprovalComponent } from './cn-flow-approval.component';

describe('CnFlowApprovalComponent', () => {
  let component: CnFlowApprovalComponent;
  let fixture: ComponentFixture<CnFlowApprovalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CnFlowApprovalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CnFlowApprovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
