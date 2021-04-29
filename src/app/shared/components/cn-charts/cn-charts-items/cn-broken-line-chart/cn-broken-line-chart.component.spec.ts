import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CnBrokenLineChartComponent } from './cn-broken-line-chart.component';

describe('CnBrokenLineChartComponent', () => {
  let component: CnBrokenLineChartComponent;
  let fixture: ComponentFixture<CnBrokenLineChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CnBrokenLineChartComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CnBrokenLineChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
