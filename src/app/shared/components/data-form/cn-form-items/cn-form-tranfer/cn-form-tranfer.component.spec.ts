import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CnFormTranferComponent } from './cn-form-tranfer.component';

describe('CnFormTranferComponent', () => {
  let component: CnFormTranferComponent;
  let fixture: ComponentFixture<CnFormTranferComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CnFormTranferComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CnFormTranferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
