import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CnFlowTableComponent } from './cn-flow-table.component';

describe('CnFlowTableComponent', () => {
  let component: CnFlowTableComponent;
  let fixture: ComponentFixture<CnFlowTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CnFlowTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CnFlowTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
