import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CfgToolbarActionDropdownComponent } from './cfg-toolbar-action-dropdown.component';

describe('CfgToolbarActionDropdownComponent', () => {
  let component: CfgToolbarActionDropdownComponent;
  let fixture: ComponentFixture<CfgToolbarActionDropdownComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CfgToolbarActionDropdownComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CfgToolbarActionDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
