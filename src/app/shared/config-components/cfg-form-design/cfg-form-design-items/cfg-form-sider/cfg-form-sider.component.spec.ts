import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CfgFormSiderComponent } from './cfg-form-sider.component';

describe('CfgFormSiderComponent', () => {
  let component: CfgFormSiderComponent;
  let fixture: ComponentFixture<CfgFormSiderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CfgFormSiderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CfgFormSiderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
