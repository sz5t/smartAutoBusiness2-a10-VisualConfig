import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CnFlowDesignComponent } from './cn-flow-design.component';

describe('CnFlowDesignComponent', () => {
  let component: CnFlowDesignComponent;
  let fixture: ComponentFixture<CnFlowDesignComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CnFlowDesignComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CnFlowDesignComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
