import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CnColorDashboardChartComponent } from './cn-color-dashboard-chart.component';

describe('CnColorDashboardChartComponent', () => {
  let component: CnColorDashboardChartComponent;
  let fixture: ComponentFixture<CnColorDashboardChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CnColorDashboardChartComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CnColorDashboardChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
