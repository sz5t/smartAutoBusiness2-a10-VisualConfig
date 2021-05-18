import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CfgPageCmptFormComponent } from './cfg-page-cmpt-form.component';

describe('CfgPageCmptFormComponent', () => {
  let component: CfgPageCmptFormComponent;
  let fixture: ComponentFixture<CfgPageCmptFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CfgPageCmptFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CfgPageCmptFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
