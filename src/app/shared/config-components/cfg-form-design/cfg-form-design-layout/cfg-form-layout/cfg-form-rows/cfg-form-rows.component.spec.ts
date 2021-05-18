import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CfgFormRowsComponent } from './cfg-form-rows.component';

describe('CfgFormRowsComponent', () => {
  let component: CfgFormRowsComponent;
  let fixture: ComponentFixture<CfgFormRowsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CfgFormRowsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CfgFormRowsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
