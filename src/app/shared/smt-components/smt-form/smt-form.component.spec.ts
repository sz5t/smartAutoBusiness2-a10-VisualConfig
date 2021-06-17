import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SmtFormComponent } from './smt-form.component';

describe('SmtFormComponent', () => {
  let component: SmtFormComponent;
  let fixture: ComponentFixture<SmtFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SmtFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SmtFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
