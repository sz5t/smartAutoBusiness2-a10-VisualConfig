import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CfgPageCmptToolbarComponent } from './cfg-page-cmpt-toolbar.component';

describe('CfgPageCmptToolbarComponent', () => {
  let component: CfgPageCmptToolbarComponent;
  let fixture: ComponentFixture<CfgPageCmptToolbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CfgPageCmptToolbarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CfgPageCmptToolbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
