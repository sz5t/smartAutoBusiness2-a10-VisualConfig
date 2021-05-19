import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CfgPropertyFormComponent } from './cfg-property-form.component';

describe('CfgPropertyFormComponent', () => {
  let component: CfgPropertyFormComponent;
  let fixture: ComponentFixture<CfgPropertyFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CfgPropertyFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CfgPropertyFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
