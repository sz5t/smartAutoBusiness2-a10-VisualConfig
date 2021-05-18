import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CfgPageViewComponent } from './cfg-page-view.component';

describe('CfgPageViewComponent', () => {
  let component: CfgPageViewComponent;
  let fixture: ComponentFixture<CfgPageViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CfgPageViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CfgPageViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
