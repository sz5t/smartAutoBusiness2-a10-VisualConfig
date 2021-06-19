import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SmtPopPageComponent } from './smt-pop-page.component';

describe('SmtPopPageComponent', () => {
  let component: SmtPopPageComponent;
  let fixture: ComponentFixture<SmtPopPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SmtPopPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SmtPopPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
