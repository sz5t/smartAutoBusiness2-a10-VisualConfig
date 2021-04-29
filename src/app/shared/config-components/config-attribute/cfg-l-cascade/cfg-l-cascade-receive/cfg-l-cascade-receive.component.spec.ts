import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CfgLCascadeReceiveComponent } from './cfg-l-cascade-receive.component';

describe('CfgLCascadeReceiveComponent', () => {
  let component: CfgLCascadeReceiveComponent;
  let fixture: ComponentFixture<CfgLCascadeReceiveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CfgLCascadeReceiveComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CfgLCascadeReceiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
