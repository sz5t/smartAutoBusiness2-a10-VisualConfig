import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CnCfgFlowStartComponent } from './cn-cfg-flow-start.component';

describe('CnCfgFlowStartComponent', () => {
  let component: CnCfgFlowStartComponent;
  let fixture: ComponentFixture<CnCfgFlowStartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CnCfgFlowStartComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CnCfgFlowStartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
