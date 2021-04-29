import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CnGridCustomObjectComponent } from './cn-grid-custom-object.component';

describe('CnGridCustomObjectComponent', () => {
  let component: CnGridCustomObjectComponent;
  let fixture: ComponentFixture<CnGridCustomObjectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CnGridCustomObjectComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CnGridCustomObjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
