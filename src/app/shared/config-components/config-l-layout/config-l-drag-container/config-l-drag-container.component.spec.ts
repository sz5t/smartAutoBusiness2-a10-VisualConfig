import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigLDragContainerComponent } from './config-l-drag-container.component';

describe('ConfigLDragContainerComponent', () => {
  let component: ConfigLDragContainerComponent;
  let fixture: ComponentFixture<ConfigLDragContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfigLDragContainerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigLDragContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
