import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SmtFormCodeEditComponent } from './smt-form-code-edit.component';

describe('SmtFormCodeEditComponent', () => {
  let component: SmtFormCodeEditComponent;
  let fixture: ComponentFixture<SmtFormCodeEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SmtFormCodeEditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SmtFormCodeEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
