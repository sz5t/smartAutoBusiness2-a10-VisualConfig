import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CnGridChartsComponent } from './cn-grid-charts.component';

describe('CnGridChartsComponent', () => {
  let component: CnGridChartsComponent;
  let fixture: ComponentFixture<CnGridChartsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CnGridChartsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CnGridChartsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
