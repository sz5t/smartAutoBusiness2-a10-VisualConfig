import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CfgFormSelectDesignComponent } from './cfg-form-select-design.component';

describe('CfgFormSelectDesignComponent', () => {
  let component: CfgFormSelectDesignComponent;
  let fixture: ComponentFixture<CfgFormSelectDesignComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CfgFormSelectDesignComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CfgFormSelectDesignComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
