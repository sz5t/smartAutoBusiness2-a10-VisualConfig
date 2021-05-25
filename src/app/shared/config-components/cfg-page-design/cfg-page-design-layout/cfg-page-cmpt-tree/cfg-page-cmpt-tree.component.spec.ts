import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CfgPageCmptTreeComponent } from './cfg-page-cmpt-tree.component';

describe('CfgPageCmptTreeComponent', () => {
  let component: CfgPageCmptTreeComponent;
  let fixture: ComponentFixture<CfgPageCmptTreeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CfgPageCmptTreeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CfgPageCmptTreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
