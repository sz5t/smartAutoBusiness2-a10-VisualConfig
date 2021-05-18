import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CfgFormViewComponent } from './cfg-form-view.component';

describe('CfgFormViewComponent', () => {
  let component: CfgFormViewComponent;
  let fixture: ComponentFixture<CfgFormViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CfgFormViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CfgFormViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
