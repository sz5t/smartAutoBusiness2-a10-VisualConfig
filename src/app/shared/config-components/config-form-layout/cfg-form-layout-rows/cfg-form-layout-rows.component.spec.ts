import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CfgFormLayoutRowsComponent } from './cfg-form-layout-rows.component';

describe('CfgFormLayoutRowsComponent', () => {
  let component: CfgFormLayoutRowsComponent;
  let fixture: ComponentFixture<CfgFormLayoutRowsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CfgFormLayoutRowsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CfgFormLayoutRowsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
