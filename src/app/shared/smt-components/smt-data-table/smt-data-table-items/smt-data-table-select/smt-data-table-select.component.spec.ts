import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SmtDataTableSelectComponent } from './smt-data-table-select.component';

describe('SmtDataTableSelectComponent', () => {
  let component: SmtDataTableSelectComponent;
  let fixture: ComponentFixture<SmtDataTableSelectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SmtDataTableSelectComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SmtDataTableSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
