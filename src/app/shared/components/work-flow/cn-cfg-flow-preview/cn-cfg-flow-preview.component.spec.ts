import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CnCfgFlowPreviewComponent } from './cn-cfg-flow-preview.component';

describe('CnCfgFlowPreviewComponent', () => {
  let component: CnCfgFlowPreviewComponent;
  let fixture: ComponentFixture<CnCfgFlowPreviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CnCfgFlowPreviewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CnCfgFlowPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
