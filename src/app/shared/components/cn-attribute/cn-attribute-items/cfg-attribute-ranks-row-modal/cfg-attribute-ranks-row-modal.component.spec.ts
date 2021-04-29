import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CfgAttributeRanksRowModalComponent } from './cfg-attribute-ranks-row-modal.component';

describe('CfgAttributeRanksRowModalComponent', () => {
  let component: CfgAttributeRanksRowModalComponent;
  let fixture: ComponentFixture<CfgAttributeRanksRowModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CfgAttributeRanksRowModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CfgAttributeRanksRowModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
