import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CfgPagePropertyComponent } from './cfg-page-property.component';

describe('CfgPagePropertyComponent', () => {
  let component: CfgPagePropertyComponent;
  let fixture: ComponentFixture<CfgPagePropertyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CfgPagePropertyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CfgPagePropertyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
