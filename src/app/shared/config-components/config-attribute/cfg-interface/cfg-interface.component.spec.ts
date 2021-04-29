import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CfgInterfaceComponent } from './cfg-interface.component';

describe('CfgInterfaceComponent', () => {
  let component: CfgInterfaceComponent;
  let fixture: ComponentFixture<CfgInterfaceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CfgInterfaceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CfgInterfaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
