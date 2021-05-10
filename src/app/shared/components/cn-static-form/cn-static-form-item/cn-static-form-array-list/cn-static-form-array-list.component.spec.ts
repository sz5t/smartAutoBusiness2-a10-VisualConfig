import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CnStaticFormArrayListComponent } from './cn-static-form-array-list.component';

describe('CnStaticFormArrayListComponent', () => {
  let component: CnStaticFormArrayListComponent;
  let fixture: ComponentFixture<CnStaticFormArrayListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CnStaticFormArrayListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CnStaticFormArrayListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
