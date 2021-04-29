import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CnFlowPreviewComponent } from './cn-flow-preview.component';

describe('CnFlowPreviewComponent', () => {
  let component: CnFlowPreviewComponent;
  let fixture: ComponentFixture<CnFlowPreviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CnFlowPreviewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CnFlowPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
