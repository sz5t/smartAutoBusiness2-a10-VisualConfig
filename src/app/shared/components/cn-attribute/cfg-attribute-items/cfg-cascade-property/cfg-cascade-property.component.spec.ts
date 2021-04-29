import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CfgCascadePropertyComponent } from './cfg-cascade-property.component';

describe('CfgCascadePropertyComponent', () => {
  let component: CfgCascadePropertyComponent;
  let fixture: ComponentFixture<CfgCascadePropertyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CfgCascadePropertyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CfgCascadePropertyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
