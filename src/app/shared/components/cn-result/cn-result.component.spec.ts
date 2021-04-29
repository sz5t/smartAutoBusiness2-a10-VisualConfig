import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CnResultComponent } from './cn-result.component';

describe('CnResultComponent', () => {
  let component: CnResultComponent;
  let fixture: ComponentFixture<CnResultComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CnResultComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CnResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
