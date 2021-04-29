import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CfgAttributeAssembleResourceSelectComponent } from './cfg-attribute-assemble-resource-select.component';

describe('CfgAttributeAssembleResourceSelectComponent', () => {
  let component: CfgAttributeAssembleResourceSelectComponent;
  let fixture: ComponentFixture<CfgAttributeAssembleResourceSelectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CfgAttributeAssembleResourceSelectComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CfgAttributeAssembleResourceSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
