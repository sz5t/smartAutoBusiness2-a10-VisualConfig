import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CfgPageRowsComponent } from './cfg-page-rows.component';

describe('CfgPageRowsComponent', () => {
  let component: CfgPageRowsComponent;
  let fixture: ComponentFixture<CfgPageRowsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CfgPageRowsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CfgPageRowsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
