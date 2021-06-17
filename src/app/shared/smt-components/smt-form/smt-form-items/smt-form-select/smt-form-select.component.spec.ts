import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SmtFormSelectComponent } from './smt-form-select.component';

describe('SmtFormSelectComponent', () => {
  let component: SmtFormSelectComponent;
  let fixture: ComponentFixture<SmtFormSelectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SmtFormSelectComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SmtFormSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
