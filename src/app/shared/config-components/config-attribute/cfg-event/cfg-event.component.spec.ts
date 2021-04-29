import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CfgEventComponent } from './cfg-event.component';

describe('CfgEventComponent', () => {
  let component: CfgEventComponent;
  let fixture: ComponentFixture<CfgEventComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CfgEventComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CfgEventComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
