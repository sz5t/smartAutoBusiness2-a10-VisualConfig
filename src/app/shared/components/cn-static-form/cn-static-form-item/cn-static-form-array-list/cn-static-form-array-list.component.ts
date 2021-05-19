import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-cn-static-form-array-list',
  templateUrl: './cn-static-form-array-list.component.html',
  styles: [
  ]
})
export class CnStaticFormArrayListComponent implements OnInit {
  @Input() validateForm: FormGroup;
  @Input() config;
  @Output() public updateValue = new EventEmitter<any>(true);
  constructor() { }

  ngOnInit(): void {
  }

}
