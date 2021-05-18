import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CfgPageLayoutComponent } from './cfg-page-layout.component';

describe('CfgPageLayoutComponent', () => {
  let component: CfgPageLayoutComponent;
  let fixture: ComponentFixture<CfgPageLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CfgPageLayoutComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CfgPageLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
