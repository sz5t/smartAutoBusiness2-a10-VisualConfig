import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SmtDataTableTagComponent } from './smt-data-table-tag.component';

describe('SmtDataTableTagComponent', () => {
  let component: SmtDataTableTagComponent;
  let fixture: ComponentFixture<SmtDataTableTagComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SmtDataTableTagComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SmtDataTableTagComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
