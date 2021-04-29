import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CnFunnelChartComponent } from './cn-funnel-chart.component';

describe('CnFunnelChartComponent', () => {
  let component: CnFunnelChartComponent;
  let fixture: ComponentFixture<CnFunnelChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CnFunnelChartComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CnFunnelChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
