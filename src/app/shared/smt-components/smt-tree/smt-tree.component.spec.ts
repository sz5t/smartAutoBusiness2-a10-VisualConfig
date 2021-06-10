import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SmtTreeComponent } from './smt-tree.component';

describe('SmtTreeComponent', () => {
  let component: SmtTreeComponent;
  let fixture: ComponentFixture<SmtTreeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SmtTreeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SmtTreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
