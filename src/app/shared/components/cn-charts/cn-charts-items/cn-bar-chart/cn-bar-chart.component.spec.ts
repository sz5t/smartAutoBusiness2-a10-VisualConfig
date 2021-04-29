import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CnBarChartComponent } from './cn-bar-chart.component';

describe('CnBarChartComponent', () => {
  let component: CnBarChartComponent;
  let fixture: ComponentFixture<CnBarChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CnBarChartComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CnBarChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
