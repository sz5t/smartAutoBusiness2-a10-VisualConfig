import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SmtFormSpanComponent } from './smt-form-span.component';

describe('SmtFormSpanComponent', () => {
  let component: SmtFormSpanComponent;
  let fixture: ComponentFixture<SmtFormSpanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SmtFormSpanComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SmtFormSpanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
