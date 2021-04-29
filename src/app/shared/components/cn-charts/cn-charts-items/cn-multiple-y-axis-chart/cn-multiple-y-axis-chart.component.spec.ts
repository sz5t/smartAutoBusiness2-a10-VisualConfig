import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CnMultipleYAxisChartComponent } from './cn-multiple-y-axis-chart.component';

describe('CnMultipleYAxisChartComponent', () => {
  let component: CnMultipleYAxisChartComponent;
  let fixture: ComponentFixture<CnMultipleYAxisChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CnMultipleYAxisChartComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CnMultipleYAxisChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
