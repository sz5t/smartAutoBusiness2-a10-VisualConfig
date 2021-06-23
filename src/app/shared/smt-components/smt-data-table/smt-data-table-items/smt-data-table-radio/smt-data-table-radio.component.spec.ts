import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SmtDataTableRadioComponent } from './smt-data-table-radio.component';

describe('SmtDataTableRadioComponent', () => {
  let component: SmtDataTableRadioComponent;
  let fixture: ComponentFixture<SmtDataTableRadioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SmtDataTableRadioComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SmtDataTableRadioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
