import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-cn-static-form-object-card',
  templateUrl: './cn-static-form-object-card.component.html',
  styles: [
  ]
})
export class CnStaticFormObjectCardComponent implements OnInit {
  @Input() validateForm: FormGroup;
  @Input() config;
  @Output() public updateValue = new EventEmitter<any>(true);
  @Output() public cascadeValue = new EventEmitter<any>(true);
  constructor() { }

  ngOnInit(): void {
  }

  cascadeValueEmit(back?) {
    console.log('object==级联');
  }

}
