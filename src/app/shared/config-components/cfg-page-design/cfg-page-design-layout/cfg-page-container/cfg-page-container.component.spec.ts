import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CfgPageContainerComponent } from './cfg-page-container.component';

describe('CfgPageContainerComponent', () => {
  let component: CfgPageContainerComponent;
  let fixture: ComponentFixture<CfgPageContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CfgPageContainerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CfgPageContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
