import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CnStaticFormContainersComponent } from './cn-static-form-containers.component';

describe('CnStaticFormContainersComponent', () => {
  let component: CnStaticFormContainersComponent;
  let fixture: ComponentFixture<CnStaticFormContainersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CnStaticFormContainersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CnStaticFormContainersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
