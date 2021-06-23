import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SmtDataTableGridSelectComponent } from './smt-data-table-grid-select.component';

describe('SmtDataTableGridSelectComponent', () => {
  let component: SmtDataTableGridSelectComponent;
  let fixture: ComponentFixture<SmtDataTableGridSelectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SmtDataTableGridSelectComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SmtDataTableGridSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
