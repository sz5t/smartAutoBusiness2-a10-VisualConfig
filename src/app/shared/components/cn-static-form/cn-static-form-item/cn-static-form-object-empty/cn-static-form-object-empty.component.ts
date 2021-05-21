import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { configFormDataServerService } from 'src/app/core/services/config/form-data.service';

@Component({
  selector: 'app-cn-static-form-object-empty',
  templateUrl: './cn-static-form-object-empty.component.html',
  styles: [
  ]
})
export class CnStaticFormObjectEmptyComponent implements OnInit {
  @Input() validateForm: FormGroup;
  @Input() config;
  @Output() public updateValue = new EventEmitter<any>(true);
  @Output() public cascadeValue = new EventEmitter<any>(true);
  @Input() public fromDataService: configFormDataServerService;
  constructor() { }

  ngOnInit(): void {
  }

  cascadeValueEmit(back?) {
    console.log('object==级联');
  }


}
