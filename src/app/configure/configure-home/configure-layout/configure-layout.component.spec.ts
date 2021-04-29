import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigureLayoutComponent } from './configure-layout.component';

describe('ConfigureLayoutComponent', () => {
  let component: ConfigureLayoutComponent;
  let fixture: ComponentFixture<ConfigureLayoutComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfigureLayoutComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigureLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
