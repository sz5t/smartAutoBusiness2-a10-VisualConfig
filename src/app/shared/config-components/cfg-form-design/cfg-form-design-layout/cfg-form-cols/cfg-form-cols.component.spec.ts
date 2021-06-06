import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CfgFormColsComponent } from './cfg-form-cols.component';

describe('CfgFormColsComponent', () => {
  let component: CfgFormColsComponent;
  let fixture: ComponentFixture<CfgFormColsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CfgFormColsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CfgFormColsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
