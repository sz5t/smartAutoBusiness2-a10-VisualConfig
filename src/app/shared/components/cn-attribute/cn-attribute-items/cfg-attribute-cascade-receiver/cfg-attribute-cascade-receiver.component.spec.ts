import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CfgAttributeCascadeReceiverComponent } from './cfg-attribute-cascade-receiver.component';

describe('CfgAttributeCascadeReceiverComponent', () => {
  let component: CfgAttributeCascadeReceiverComponent;
  let fixture: ComponentFixture<CfgAttributeCascadeReceiverComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CfgAttributeCascadeReceiverComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CfgAttributeCascadeReceiverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
