import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CfgBracketsComponent } from './cfg-brackets.component';

describe('CfgBracketsComponent', () => {
  let component: CfgBracketsComponent;
  let fixture: ComponentFixture<CfgBracketsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CfgBracketsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CfgBracketsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
