import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CnStaticFormPopApiComponent } from './cn-static-form-pop-api.component';

describe('CnStaticFormPopApiComponent', () => {
  let component: CnStaticFormPopApiComponent;
  let fixture: ComponentFixture<CnStaticFormPopApiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CnStaticFormPopApiComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CnStaticFormPopApiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
