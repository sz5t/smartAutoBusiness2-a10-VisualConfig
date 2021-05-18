import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CfgPageColComponent } from './cfg-page-col.component';

describe('CfgPageColComponent', () => {
  let component: CfgPageColComponent;
  let fixture: ComponentFixture<CfgPageColComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CfgPageColComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CfgPageColComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
