import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CfgPageCmptTabsComponent } from './cfg-page-cmpt-tabs.component';

describe('CfgPageCmptTabsComponent', () => {
  let component: CfgPageCmptTabsComponent;
  let fixture: ComponentFixture<CfgPageCmptTabsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CfgPageCmptTabsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CfgPageCmptTabsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
