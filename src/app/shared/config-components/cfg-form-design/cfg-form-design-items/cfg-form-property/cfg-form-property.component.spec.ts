import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CfgFormPropertyComponent } from './cfg-form-property.component';

describe('CfgFormPropertyComponent', () => {
  let component: CfgFormPropertyComponent;
  let fixture: ComponentFixture<CfgFormPropertyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CfgFormPropertyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CfgFormPropertyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
