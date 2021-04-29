import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CfgLFormSiderComponent } from './cfg-l-form-sider.component';

describe('CfgLFormSiderComponent', () => {
  let component: CfgLFormSiderComponent;
  let fixture: ComponentFixture<CfgLFormSiderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CfgLFormSiderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CfgLFormSiderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
