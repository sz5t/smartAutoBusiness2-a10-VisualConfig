import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CnMultiLevelFacetChartComponent } from './cn-multi-level-facet-chart.component';

describe('CnMultiLevelFacetChartComponent', () => {
  let component: CnMultiLevelFacetChartComponent;
  let fixture: ComponentFixture<CnMultiLevelFacetChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CnMultiLevelFacetChartComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CnMultiLevelFacetChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
