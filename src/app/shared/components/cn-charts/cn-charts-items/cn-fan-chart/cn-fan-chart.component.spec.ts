import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CnFanChartComponent } from './cn-fan-chart.component';

describe('CnFanChartComponent', () => {
  let component: CnFanChartComponent;
  let fixture: ComponentFixture<CnFanChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CnFanChartComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CnFanChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
