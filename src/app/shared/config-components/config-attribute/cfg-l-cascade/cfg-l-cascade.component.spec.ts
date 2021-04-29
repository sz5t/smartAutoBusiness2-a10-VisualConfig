import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CfgLCascadeComponent } from './cfg-l-cascade.component';

describe('CfgLCascadeComponent', () => {
  let component: CfgLCascadeComponent;
  let fixture: ComponentFixture<CfgLCascadeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CfgLCascadeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CfgLCascadeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
