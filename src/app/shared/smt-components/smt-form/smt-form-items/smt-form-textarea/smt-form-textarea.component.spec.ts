import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SmtFormTextareaComponent } from './smt-form-textarea.component';

describe('SmtFormTextareaComponent', () => {
  let component: SmtFormTextareaComponent;
  let fixture: ComponentFixture<SmtFormTextareaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SmtFormTextareaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SmtFormTextareaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
