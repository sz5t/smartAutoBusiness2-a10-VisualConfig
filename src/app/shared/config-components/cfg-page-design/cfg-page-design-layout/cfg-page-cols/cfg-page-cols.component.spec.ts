import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CfgPageColsComponent } from './cfg-page-cols.component';

describe('CfgPageColsComponent', () => {
  let component: CfgPageColsComponent;
  let fixture: ComponentFixture<CfgPageColsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CfgPageColsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CfgPageColsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
