import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CnFlowDesignMoreComponent } from './cn-flow-design-more.component';

describe('CnFlowDesignMoreComponent', () => {
  let component: CnFlowDesignMoreComponent;
  let fixture: ComponentFixture<CnFlowDesignMoreComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CnFlowDesignMoreComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CnFlowDesignMoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
