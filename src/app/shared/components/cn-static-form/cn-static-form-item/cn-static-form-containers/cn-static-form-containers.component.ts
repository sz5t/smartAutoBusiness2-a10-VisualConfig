import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-cn-static-form-containers',
  templateUrl: './cn-static-form-containers.component.html',
  styles: [
  ]
})
export class CnStaticFormContainersComponent implements OnInit {

  @Input() validateForm: FormGroup;
  @Input() config;
  @Input() public fromDataService;
  @Output() public updateValue = new EventEmitter<any>(true);
  constructor() { }

  ngOnInit(): void {
  }

}
