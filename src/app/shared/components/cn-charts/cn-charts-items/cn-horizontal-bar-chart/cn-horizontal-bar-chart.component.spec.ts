import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CnHorizontalBarChartComponent } from './cn-horizontal-bar-chart.component';

describe('CnHorizontalBarChartComponent', () => {
  let component: CnHorizontalBarChartComponent;
  let fixture: ComponentFixture<CnHorizontalBarChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CnHorizontalBarChartComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CnHorizontalBarChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
