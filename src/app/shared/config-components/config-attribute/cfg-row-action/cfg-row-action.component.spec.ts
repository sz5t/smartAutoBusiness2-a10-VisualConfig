import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CfgRowActionComponent } from './cfg-row-action.component';

describe('CfgRowActionComponent', () => {
  let component: CfgRowActionComponent;
  let fixture: ComponentFixture<CfgRowActionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CfgRowActionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CfgRowActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
