import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CfgLCascadeSendItemComponent } from './cfg-l-cascade-send-item.component';

describe('CfgLCascadeSendItemComponent', () => {
  let component: CfgLCascadeSendItemComponent;
  let fixture: ComponentFixture<CfgLCascadeSendItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CfgLCascadeSendItemComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CfgLCascadeSendItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
