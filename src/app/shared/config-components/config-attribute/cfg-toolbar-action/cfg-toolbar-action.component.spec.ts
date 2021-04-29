import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CfgToolbarActionComponent } from './cfg-toolbar-action.component';

describe('CfgToolbarActionComponent', () => {
  let component: CfgToolbarActionComponent;
  let fixture: ComponentFixture<CfgToolbarActionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CfgToolbarActionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CfgToolbarActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
