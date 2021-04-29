import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CfgLFormAttrCtrEditorComponent } from './cfg-l-form-attr-ctr-editor.component';

describe('CfgLFormAttrCtrEditorComponent', () => {
  let component: CfgLFormAttrCtrEditorComponent;
  let fixture: ComponentFixture<CfgLFormAttrCtrEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CfgLFormAttrCtrEditorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CfgLFormAttrCtrEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
