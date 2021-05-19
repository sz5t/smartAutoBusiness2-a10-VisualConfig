import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CnStaticFormObjectCardComponent } from './cn-static-form-object-card.component';

describe('CnStaticFormObjectCardComponent', () => {
  let component: CnStaticFormObjectCardComponent;
  let fixture: ComponentFixture<CnStaticFormObjectCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CnStaticFormObjectCardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CnStaticFormObjectCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
