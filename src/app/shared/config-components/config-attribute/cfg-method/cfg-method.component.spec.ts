import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CfgMethodComponent } from './cfg-method.component';

describe('CfgMethodComponent', () => {
  let component: CfgMethodComponent;
  let fixture: ComponentFixture<CfgMethodComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CfgMethodComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CfgMethodComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
