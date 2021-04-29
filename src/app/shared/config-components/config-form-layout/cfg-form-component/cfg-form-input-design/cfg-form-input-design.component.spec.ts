import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CfgFormInputDesignComponent } from './cfg-form-input-design.component';

describe('CfgFormInputDesignComponent', () => {
  let component: CfgFormInputDesignComponent;
  let fixture: ComponentFixture<CfgFormInputDesignComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CfgFormInputDesignComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CfgFormInputDesignComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
