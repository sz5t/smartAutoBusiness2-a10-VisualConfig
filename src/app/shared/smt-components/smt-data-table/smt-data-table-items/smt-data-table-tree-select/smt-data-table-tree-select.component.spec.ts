import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SmtDataTableTreeSelectComponent } from './smt-data-table-tree-select.component';

describe('SmtDataTableTreeSelectComponent', () => {
  let component: SmtDataTableTreeSelectComponent;
  let fixture: ComponentFixture<SmtDataTableTreeSelectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SmtDataTableTreeSelectComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SmtDataTableTreeSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
