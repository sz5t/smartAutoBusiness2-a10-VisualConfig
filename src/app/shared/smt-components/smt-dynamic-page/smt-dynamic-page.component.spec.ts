import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SmtDynamicPageComponent } from './smt-dynamic-page.component';

describe('SmtDynamicPageComponent', () => {
  let component: SmtDynamicPageComponent;
  let fixture: ComponentFixture<SmtDynamicPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SmtDynamicPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SmtDynamicPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
