import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CfgFormColComponent } from './cfg-form-col.component';

describe('CfgFormColComponent', () => {
  let component: CfgFormColComponent;
  let fixture: ComponentFixture<CfgFormColComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CfgFormColComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CfgFormColComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
