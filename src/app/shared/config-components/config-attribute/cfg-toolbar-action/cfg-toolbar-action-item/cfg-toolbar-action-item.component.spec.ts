import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CfgToolbarActionItemComponent } from './cfg-toolbar-action-item.component';

describe('CfgToolbarActionItemComponent', () => {
  let component: CfgToolbarActionItemComponent;
  let fixture: ComponentFixture<CfgToolbarActionItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CfgToolbarActionItemComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CfgToolbarActionItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
