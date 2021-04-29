import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CfgLCascadeSendComponent } from './cfg-l-cascade-send.component';

describe('CfgLCascadeSendComponent', () => {
  let component: CfgLCascadeSendComponent;
  let fixture: ComponentFixture<CfgLCascadeSendComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CfgLCascadeSendComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CfgLCascadeSendComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
