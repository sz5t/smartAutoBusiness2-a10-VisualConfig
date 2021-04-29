import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigLColsComponent } from './config-l-cols.component';

describe('ConfigLColsComponent', () => {
  let component: ConfigLColsComponent;
  let fixture: ComponentFixture<ConfigLColsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfigLColsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigLColsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
