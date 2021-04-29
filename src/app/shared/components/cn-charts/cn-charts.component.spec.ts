import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CnChartsComponent } from './cn-charts.component';

describe('CnChartsComponent', () => {
  let component: CnChartsComponent;
  let fixture: ComponentFixture<CnChartsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CnChartsComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CnChartsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});