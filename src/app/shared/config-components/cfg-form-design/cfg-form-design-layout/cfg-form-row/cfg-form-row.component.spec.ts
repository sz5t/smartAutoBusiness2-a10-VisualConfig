import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CfgFormRowComponent } from './cfg-form-row.component';

describe('CfgFormRowComponent', () => {
  let component: CfgFormRowComponent;
  let fixture: ComponentFixture<CfgFormRowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CfgFormRowComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CfgFormRowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
