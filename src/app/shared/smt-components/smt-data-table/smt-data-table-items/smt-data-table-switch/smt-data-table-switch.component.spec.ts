import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SmtDataTableSwitchComponent } from './smt-data-table-switch.component';

describe('SmtDataTableSwitchComponent', () => {
  let component: SmtDataTableSwitchComponent;
  let fixture: ComponentFixture<SmtDataTableSwitchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SmtDataTableSwitchComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SmtDataTableSwitchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
