import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CnDashboardChartComponent } from './cn-dashboard-chart.component';

describe('CnDashboardChartComponent', () => {
  let component: CnDashboardChartComponent;
  let fixture: ComponentFixture<CnDashboardChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CnDashboardChartComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CnDashboardChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
