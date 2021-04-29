import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CnFormObjectComponent } from './cn-form-object.component';

describe('CnFormObjectComponent', () => {
  let component: CnFormObjectComponent;
  let fixture: ComponentFixture<CnFormObjectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CnFormObjectComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CnFormObjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
