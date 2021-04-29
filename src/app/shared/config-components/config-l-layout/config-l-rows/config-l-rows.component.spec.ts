import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigLRowsComponent } from './config-l-rows.component';

describe('ConfigLRowsComponent', () => {
  let component: ConfigLRowsComponent;
  let fixture: ComponentFixture<ConfigLRowsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfigLRowsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigLRowsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
