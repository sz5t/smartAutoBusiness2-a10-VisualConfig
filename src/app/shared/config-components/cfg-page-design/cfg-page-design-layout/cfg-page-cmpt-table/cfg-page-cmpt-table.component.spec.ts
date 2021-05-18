import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CfgPageCmptTableComponent } from './cfg-page-cmpt-table.component';

describe('CfgPageCmptTableComponent', () => {
  let component: CfgPageCmptTableComponent;
  let fixture: ComponentFixture<CfgPageCmptTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CfgPageCmptTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CfgPageCmptTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
