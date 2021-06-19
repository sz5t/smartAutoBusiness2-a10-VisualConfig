import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SmtFormLabelComponent } from './smt-form-label.component';

describe('SmtFormLabelComponent', () => {
  let component: SmtFormLabelComponent;
  let fixture: ComponentFixture<SmtFormLabelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SmtFormLabelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SmtFormLabelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
