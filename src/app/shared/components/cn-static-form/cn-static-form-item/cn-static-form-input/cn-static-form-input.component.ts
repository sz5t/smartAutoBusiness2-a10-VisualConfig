import { Component, Input, OnInit, EventEmitter, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { configFormDataServerService } from 'src/app/core/services/config/form-data.service';

@Component({
  selector: 'app-cn-static-form-input',
  templateUrl: './cn-static-form-input.component.html',
  styles: [
  ]
})
export class CnStaticFormInputComponent implements OnInit {
  @Input() validateForm: FormGroup;
  @Input() config;
  @Input() public fromDataService: configFormDataServerService;
  @Output() public updateValue = new EventEmitter<any>(true);
  constructor() { }

  ngOnInit(): void {
  }

}
