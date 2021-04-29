import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CfgAtrributeCascadeSenderComponent } from './cfg-atrribute-cascade-sender.component';

describe('CfgAtrributeCascadeSenderComponent', () => {
  let component: CfgAtrributeCascadeSenderComponent;
  let fixture: ComponentFixture<CfgAtrributeCascadeSenderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CfgAtrributeCascadeSenderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CfgAtrributeCascadeSenderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
