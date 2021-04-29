import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CfgFormLayoutColsComponent } from './cfg-form-layout-cols.component';

describe('CfgFormLayoutColsComponent', () => {
  let component: CfgFormLayoutColsComponent;
  let fixture: ComponentFixture<CfgFormLayoutColsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CfgFormLayoutColsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CfgFormLayoutColsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
