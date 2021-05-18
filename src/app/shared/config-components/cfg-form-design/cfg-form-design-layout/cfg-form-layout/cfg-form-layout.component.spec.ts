import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CfgFormLayoutComponent } from './cfg-form-layout.component';

describe('CfgFormLayoutComponent', () => {
  let component: CfgFormLayoutComponent;
  let fixture: ComponentFixture<CfgFormLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CfgFormLayoutComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CfgFormLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
