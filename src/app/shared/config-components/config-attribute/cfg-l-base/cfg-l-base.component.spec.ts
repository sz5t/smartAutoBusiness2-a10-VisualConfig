import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CfgLBaseComponent } from './cfg-l-base.component';

describe('CfgLBaseComponent', () => {
  let component: CfgLBaseComponent;
  let fixture: ComponentFixture<CfgLBaseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CfgLBaseComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CfgLBaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
