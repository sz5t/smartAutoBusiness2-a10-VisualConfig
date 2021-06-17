import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SmtFormRadioComponent } from './smt-form-radio.component';

describe('SmtFormRadioComponent', () => {
  let component: SmtFormRadioComponent;
  let fixture: ComponentFixture<SmtFormRadioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SmtFormRadioComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SmtFormRadioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
