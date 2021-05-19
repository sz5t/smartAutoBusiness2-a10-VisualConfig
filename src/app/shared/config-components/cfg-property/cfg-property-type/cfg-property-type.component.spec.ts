import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CfgPropertyTypeComponent } from './cfg-property-type.component';

describe('CfgPropertyTypeComponent', () => {
  let component: CfgPropertyTypeComponent;
  let fixture: ComponentFixture<CfgPropertyTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CfgPropertyTypeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CfgPropertyTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
