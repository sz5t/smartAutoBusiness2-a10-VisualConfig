import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CfgFormContainerComponent } from './cfg-form-container.component';

describe('CfgFormContainerComponent', () => {
  let component: CfgFormContainerComponent;
  let fixture: ComponentFixture<CfgFormContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CfgFormContainerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CfgFormContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
