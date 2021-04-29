import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CfgInterfaceItemComponent } from './cfg-interface-item.component';

describe('CfgInterfaceItemComponent', () => {
  let component: CfgInterfaceItemComponent;
  let fixture: ComponentFixture<CfgInterfaceItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CfgInterfaceItemComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CfgInterfaceItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
