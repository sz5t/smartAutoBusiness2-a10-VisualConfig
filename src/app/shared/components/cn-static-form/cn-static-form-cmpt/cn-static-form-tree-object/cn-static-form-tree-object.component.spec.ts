import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CnStaticFormTreeObjectComponent } from './cn-static-form-tree-object.component';

describe('CnStaticFormTreeObjectComponent', () => {
  let component: CnStaticFormTreeObjectComponent;
  let fixture: ComponentFixture<CnStaticFormTreeObjectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CnStaticFormTreeObjectComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CnStaticFormTreeObjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
