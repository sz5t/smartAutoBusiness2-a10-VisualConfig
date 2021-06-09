import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CnStaticFormSelectTreeComponent } from './cn-static-form-select-tree.component';

describe('CnStaticFormSelectTreeComponent', () => {
  let component: CnStaticFormSelectTreeComponent;
  let fixture: ComponentFixture<CnStaticFormSelectTreeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CnStaticFormSelectTreeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CnStaticFormSelectTreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
