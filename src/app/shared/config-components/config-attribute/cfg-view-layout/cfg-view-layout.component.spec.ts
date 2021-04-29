import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CfgViewLayoutComponent } from './cfg-view-layout.component';

describe('CfgViewLayoutComponent', () => {
  let component: CfgViewLayoutComponent;
  let fixture: ComponentFixture<CfgViewLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CfgViewLayoutComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CfgViewLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
