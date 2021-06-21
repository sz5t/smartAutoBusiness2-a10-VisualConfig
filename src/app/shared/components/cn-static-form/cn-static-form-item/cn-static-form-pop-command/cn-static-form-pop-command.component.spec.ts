import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CnStaticFormPopCommandComponent } from './cn-static-form-pop-command.component';

describe('CnStaticFormPopCommandComponent', () => {
  let component: CnStaticFormPopCommandComponent;
  let fixture: ComponentFixture<CnStaticFormPopCommandComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CnStaticFormPopCommandComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CnStaticFormPopCommandComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
