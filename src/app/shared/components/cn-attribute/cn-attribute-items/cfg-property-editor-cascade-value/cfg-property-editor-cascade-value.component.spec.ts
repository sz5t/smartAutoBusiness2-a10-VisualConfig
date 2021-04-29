import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CfgPropertyEditorCascadeValueComponent } from './cfg-property-editor-cascade-value.component';

describe('CfgPropertyEditorCascadeValueComponent', () => {
  let component: CfgPropertyEditorCascadeValueComponent;
  let fixture: ComponentFixture<CfgPropertyEditorCascadeValueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CfgPropertyEditorCascadeValueComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CfgPropertyEditorCascadeValueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
