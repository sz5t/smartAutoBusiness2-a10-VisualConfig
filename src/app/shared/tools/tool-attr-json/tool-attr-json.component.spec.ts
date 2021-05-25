import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ToolAttrJsonComponent } from './tool-attr-json.component';

describe('ToolAttrJsonComponent', () => {
  let component: ToolAttrJsonComponent;
  let fixture: ComponentFixture<ToolAttrJsonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ToolAttrJsonComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ToolAttrJsonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
