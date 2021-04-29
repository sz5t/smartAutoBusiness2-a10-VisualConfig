import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CfgLFormAttrSiderComponent } from './cfg-l-form-attr-sider.component';

describe('CfgLFormAttrSiderComponent', () => {
  let component: CfgLFormAttrSiderComponent;
  let fixture: ComponentFixture<CfgLFormAttrSiderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CfgLFormAttrSiderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CfgLFormAttrSiderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
