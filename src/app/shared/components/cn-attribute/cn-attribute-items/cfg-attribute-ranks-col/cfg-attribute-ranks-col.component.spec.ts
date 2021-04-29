import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CfgAttributeRanksColComponent } from './cfg-attribute-ranks-col.component';

describe('CfgAttributeRanksColComponent', () => {
  let component: CfgAttributeRanksColComponent;
  let fixture: ComponentFixture<CfgAttributeRanksColComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CfgAttributeRanksColComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CfgAttributeRanksColComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
