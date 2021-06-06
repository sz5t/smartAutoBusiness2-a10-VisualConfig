import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CfgFormCheckComponent } from './cfg-form-check.component';

describe('CfgFormCheckComponent', () => {
  let component: CfgFormCheckComponent;
  let fixture: ComponentFixture<CfgFormCheckComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CfgFormCheckComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CfgFormCheckComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
