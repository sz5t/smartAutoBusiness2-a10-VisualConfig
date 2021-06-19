import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CnCfgBusiFlowComponent } from './cn-cfg-busi-flow.component';

describe('CnCfgBusiFlowComponent', () => {
  let component: CnCfgBusiFlowComponent;
  let fixture: ComponentFixture<CnCfgBusiFlowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CnCfgBusiFlowComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CnCfgBusiFlowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
