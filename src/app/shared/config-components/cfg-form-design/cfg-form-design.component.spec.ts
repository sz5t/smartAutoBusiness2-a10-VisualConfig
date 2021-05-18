import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CfgFormDesignComponent } from './cfg-form-design.component';

describe('CfgFormDesignComponent', () => {
  let component: CfgFormDesignComponent;
  let fixture: ComponentFixture<CfgFormDesignComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CfgFormDesignComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CfgFormDesignComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
