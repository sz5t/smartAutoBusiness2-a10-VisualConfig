import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CfgLFormSelectParameterComponent } from './cfg-l-form-select-parameter.component';

describe('CfgLFormSelectParameterComponent', () => {
  let component: CfgLFormSelectParameterComponent;
  let fixture: ComponentFixture<CfgLFormSelectParameterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CfgLFormSelectParameterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CfgLFormSelectParameterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
