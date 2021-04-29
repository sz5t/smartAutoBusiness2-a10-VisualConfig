import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigLDragComponent } from './config-l-drag.component';

describe('ConfigLDragComponent', () => {
  let component: ConfigLDragComponent;
  let fixture: ComponentFixture<ConfigLDragComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfigLDragComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigLDragComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
