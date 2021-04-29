import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CnDynamicContainersComponent } from './cn-dynamic-containers.component';

describe('CnDynamicContainersComponent', () => {
  let component: CnDynamicContainersComponent;
  let fixture: ComponentFixture<CnDynamicContainersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CnDynamicContainersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CnDynamicContainersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
