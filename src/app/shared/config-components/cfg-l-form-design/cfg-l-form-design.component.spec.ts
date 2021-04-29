import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CfgLFormDesignComponent } from './cfg-l-form-design.component';

describe('CfgLFormDesignComponent', () => {
  let component: CfgLFormDesignComponent;
  let fixture: ComponentFixture<CfgLFormDesignComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CfgLFormDesignComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CfgLFormDesignComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
