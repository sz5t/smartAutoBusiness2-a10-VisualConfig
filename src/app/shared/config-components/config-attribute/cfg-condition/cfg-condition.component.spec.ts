import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CfgConditionComponent } from './cfg-condition.component';

describe('CfgConditionComponent', () => {
  let component: CfgConditionComponent;
  let fixture: ComponentFixture<CfgConditionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CfgConditionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CfgConditionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
