import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CfgLMainPageDesignComponent } from './cfg-l-main-page-design.component';

describe('CfgLMainPageDesignComponent', () => {
  let component: CfgLMainPageDesignComponent;
  let fixture: ComponentFixture<CfgLMainPageDesignComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CfgLMainPageDesignComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CfgLMainPageDesignComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
