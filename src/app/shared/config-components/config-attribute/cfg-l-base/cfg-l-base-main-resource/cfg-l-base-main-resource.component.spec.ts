import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CfgLBaseMainResourceComponent } from './cfg-l-base-main-resource.component';

describe('CfgLBaseMainResourceComponent', () => {
  let component: CfgLBaseMainResourceComponent;
  let fixture: ComponentFixture<CfgLBaseMainResourceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CfgLBaseMainResourceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CfgLBaseMainResourceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
