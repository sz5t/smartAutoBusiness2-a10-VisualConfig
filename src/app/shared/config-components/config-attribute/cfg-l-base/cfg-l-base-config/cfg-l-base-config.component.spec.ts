import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CfgLBaseConfigComponent } from './cfg-l-base-config.component';

describe('CfgLBaseConfigComponent', () => {
  let component: CfgLBaseConfigComponent;
  let fixture: ComponentFixture<CfgLBaseConfigComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CfgLBaseConfigComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CfgLBaseConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
