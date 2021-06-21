import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SmtDataTableInputComponent } from './smt-data-table-input.component';

describe('SmtDataTableInputComponent', () => {
  let component: SmtDataTableInputComponent;
  let fixture: ComponentFixture<SmtDataTableInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SmtDataTableInputComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SmtDataTableInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
