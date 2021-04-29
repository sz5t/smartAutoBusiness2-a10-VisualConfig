import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CfgAttributeRanksCombComponent } from './cfg-attribute-ranks-comb.component';

describe('CfgAttributeRanksCombComponent', () => {
  let component: CfgAttributeRanksCombComponent;
  let fixture: ComponentFixture<CfgAttributeRanksCombComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CfgAttributeRanksCombComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CfgAttributeRanksCombComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
