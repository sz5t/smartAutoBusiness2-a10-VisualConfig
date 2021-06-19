import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CnCfgFlowDesignComponent } from './cn-cfg-flow-design.component';

describe('CnCfgFlowDesignComponent', () => {
  let component: CnCfgFlowDesignComponent;
  let fixture: ComponentFixture<CnCfgFlowDesignComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CnCfgFlowDesignComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CnCfgFlowDesignComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
