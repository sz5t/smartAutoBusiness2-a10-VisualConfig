import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CfgEventItemComponent } from './cfg-event-item.component';

describe('CfgEventItemComponent', () => {
  let component: CfgEventItemComponent;
  let fixture: ComponentFixture<CfgEventItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CfgEventItemComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CfgEventItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
