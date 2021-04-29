import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CnFlowStartComponent } from './cn-flow-start.component';

describe('CnFlowStartComponent', () => {
  let component: CnFlowStartComponent;
  let fixture: ComponentFixture<CnFlowStartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CnFlowStartComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CnFlowStartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
