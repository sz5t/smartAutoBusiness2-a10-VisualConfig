import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SmtFormSwitchComponent } from './smt-form-switch.component';

describe('SmtFormSwitchComponent', () => {
  let component: SmtFormSwitchComponent;
  let fixture: ComponentFixture<SmtFormSwitchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SmtFormSwitchComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SmtFormSwitchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
