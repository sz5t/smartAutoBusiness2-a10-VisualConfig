import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SmtDataTableShowSpanTextComponent } from './smt-data-table-show-span-text.component';

describe('SmtDataTableShowSpanTextComponent', () => {
  let component: SmtDataTableShowSpanTextComponent;
  let fixture: ComponentFixture<SmtDataTableShowSpanTextComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SmtDataTableShowSpanTextComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SmtDataTableShowSpanTextComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
