import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SmtDataTableTextAreaComponent } from './smt-data-table-text-area.component';

describe('SmtDataTableTextAreaComponent', () => {
  let component: SmtDataTableTextAreaComponent;
  let fixture: ComponentFixture<SmtDataTableTextAreaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SmtDataTableTextAreaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SmtDataTableTextAreaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
