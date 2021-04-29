import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigLLayoutComponent } from './config-l-layout.component';

describe('ConfigLLayoutComponent', () => {
  let component: ConfigLLayoutComponent;
  let fixture: ComponentFixture<ConfigLLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfigLLayoutComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigLLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
