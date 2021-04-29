import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CnRadarMapChartComponent } from './cn-radar-map-chart.component';

describe('CnRadarMapChartComponent', () => {
  let component: CnRadarMapChartComponent;
  let fixture: ComponentFixture<CnRadarMapChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CnRadarMapChartComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CnRadarMapChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
