import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CfgPropertyConentComponent } from './cfg-property-conent.component';

describe('CfgPropertyConentComponent', () => {
  let component: CfgPropertyConentComponent;
  let fixture: ComponentFixture<CfgPropertyConentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CfgPropertyConentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CfgPropertyConentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
