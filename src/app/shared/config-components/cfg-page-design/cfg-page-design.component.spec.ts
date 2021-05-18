import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CfgPageDesignComponent } from './cfg-page-design.component';

describe('CfgPageDesignComponent', () => {
  let component: CfgPageDesignComponent;
  let fixture: ComponentFixture<CfgPageDesignComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CfgPageDesignComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CfgPageDesignComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
