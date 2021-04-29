import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CfgListensComponent } from './cfg-listens.component';

describe('CfgListensComponent', () => {
  let component: CfgListensComponent;
  let fixture: ComponentFixture<CfgListensComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CfgListensComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CfgListensComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
