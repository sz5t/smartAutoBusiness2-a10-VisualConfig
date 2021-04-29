import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CfgAttributeRanksRowComponent } from './cfg-attribute-ranks-row.component';

describe('CfgAttributeRanksRowComponent', () => {
  let component: CfgAttributeRanksRowComponent;
  let fixture: ComponentFixture<CfgAttributeRanksRowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CfgAttributeRanksRowComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CfgAttributeRanksRowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
