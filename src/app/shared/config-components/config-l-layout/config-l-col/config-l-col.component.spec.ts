import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigLColComponent } from './config-l-col.component';

describe('ConfigLColComponent', () => {
  let component: ConfigLColComponent;
  let fixture: ComponentFixture<ConfigLColComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfigLColComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigLColComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
