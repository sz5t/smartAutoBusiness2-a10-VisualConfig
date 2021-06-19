import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SmtFormTagComponent } from './smt-form-tag.component';

describe('SmtFormTagComponent', () => {
  let component: SmtFormTagComponent;
  let fixture: ComponentFixture<SmtFormTagComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SmtFormTagComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SmtFormTagComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
