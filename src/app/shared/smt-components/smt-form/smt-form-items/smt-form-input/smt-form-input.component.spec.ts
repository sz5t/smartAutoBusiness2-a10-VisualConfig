import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SmtFormInputComponent } from './smt-form-input.component';

describe('SmtFormInputComponent', () => {
  let component: SmtFormInputComponent;
  let fixture: ComponentFixture<SmtFormInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SmtFormInputComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SmtFormInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
