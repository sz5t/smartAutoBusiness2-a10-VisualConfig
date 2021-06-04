import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SmtPageComponent } from './smt-page.component';

describe('SmtPageComponent', () => {
  let component: SmtPageComponent;
  let fixture: ComponentFixture<SmtPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SmtPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SmtPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
