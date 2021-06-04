import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SmtTreeTableComponent } from './smt-tree-table.component';

describe('SmtTreeTableComponent', () => {
  let component: SmtTreeTableComponent;
  let fixture: ComponentFixture<SmtTreeTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SmtTreeTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SmtTreeTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
