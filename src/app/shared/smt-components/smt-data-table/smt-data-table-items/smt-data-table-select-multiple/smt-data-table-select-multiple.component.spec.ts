import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SmtDataTableSelectMultipleComponent } from './smt-data-table-select-multiple.component';

describe('SmtDataTableSelectMultipleComponent', () => {
  let component: SmtDataTableSelectMultipleComponent;
  let fixture: ComponentFixture<SmtDataTableSelectMultipleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SmtDataTableSelectMultipleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SmtDataTableSelectMultipleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
