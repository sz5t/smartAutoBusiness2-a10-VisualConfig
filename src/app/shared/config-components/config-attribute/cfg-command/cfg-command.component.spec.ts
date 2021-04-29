import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CfgCommandComponent } from './cfg-command.component';

describe('CfgCommandComponent', () => {
  let component: CfgCommandComponent;
  let fixture: ComponentFixture<CfgCommandComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CfgCommandComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CfgCommandComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
