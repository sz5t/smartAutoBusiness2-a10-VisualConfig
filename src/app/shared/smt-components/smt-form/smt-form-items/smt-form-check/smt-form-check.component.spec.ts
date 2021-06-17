import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SmtFormCheckComponent } from './smt-form-check.component';

describe('SmtFormCheckComponent', () => {
  let component: SmtFormCheckComponent;
  let fixture: ComponentFixture<SmtFormCheckComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SmtFormCheckComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SmtFormCheckComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
