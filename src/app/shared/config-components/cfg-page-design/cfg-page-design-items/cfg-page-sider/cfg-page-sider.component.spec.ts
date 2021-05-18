import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CfgPageSiderComponent } from './cfg-page-sider.component';

describe('CfgPageSiderComponent', () => {
  let component: CfgPageSiderComponent;
  let fixture: ComponentFixture<CfgPageSiderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CfgPageSiderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CfgPageSiderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
