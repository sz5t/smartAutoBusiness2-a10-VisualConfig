import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigLRowComponent } from './config-l-row.component';

describe('ConfigLRowComponent', () => {
  let component: ConfigLRowComponent;
  let fixture: ComponentFixture<ConfigLRowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfigLRowComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigLRowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
