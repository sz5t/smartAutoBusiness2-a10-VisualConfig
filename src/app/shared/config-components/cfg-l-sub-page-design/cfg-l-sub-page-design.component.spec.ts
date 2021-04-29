import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CfgLSubPageDesignComponent } from './cfg-l-sub-page-design.component';

describe('CfgLSubPageDesignComponent', () => {
  let component: CfgLSubPageDesignComponent;
  let fixture: ComponentFixture<CfgLSubPageDesignComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CfgLSubPageDesignComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CfgLSubPageDesignComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
