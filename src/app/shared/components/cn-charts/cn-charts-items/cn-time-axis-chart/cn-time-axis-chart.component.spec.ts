import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CnTimeAxisChartComponent } from './cn-time-axis-chart.component';

describe('CnTimeAxisChartComponent', () => {
  let component: CnTimeAxisChartComponent;
  let fixture: ComponentFixture<CnTimeAxisChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CnTimeAxisChartComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CnTimeAxisChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
