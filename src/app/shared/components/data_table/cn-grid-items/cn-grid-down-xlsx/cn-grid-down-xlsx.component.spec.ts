import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CnGridDownXlsxComponent } from './cn-grid-down-xlsx.component';

describe('CnGridDownXlsxComponent', () => {
  let component: CnGridDownXlsxComponent;
  let fixture: ComponentFixture<CnGridDownXlsxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CnGridDownXlsxComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CnGridDownXlsxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
