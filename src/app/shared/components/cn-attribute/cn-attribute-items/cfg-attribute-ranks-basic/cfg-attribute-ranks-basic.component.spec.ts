import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CfgAttributeRanksBasicComponent } from './cfg-attribute-ranks-basic.component';

describe('CfgAttributeRanksBasicComponent', () => {
  let component: CfgAttributeRanksBasicComponent;
  let fixture: ComponentFixture<CfgAttributeRanksBasicComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CfgAttributeRanksBasicComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CfgAttributeRanksBasicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
