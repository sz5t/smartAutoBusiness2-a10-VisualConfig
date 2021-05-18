import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CfgPageRowComponent } from './cfg-page-row.component';

describe('CfgPageRowComponent', () => {
  let component: CfgPageRowComponent;
  let fixture: ComponentFixture<CfgPageRowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CfgPageRowComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CfgPageRowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
