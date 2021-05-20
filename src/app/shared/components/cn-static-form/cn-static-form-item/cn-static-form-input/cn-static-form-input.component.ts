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
  @Output() public cascadeValue = new EventEmitter<any>(true);
  itemConfig: any = {
    hiddenTitle: false,
    "labelSize": {
      "span": 8,
      "nzXs": {
        "span": 8,
        "offset": 0
      },
      "nzSm": {
        "span": 8,
        "offset": 0
      },
      "nzMd": {
        "span": 8,
        "offset": 0
      },
      "nzLg": {
        "span": 8,
        "offset": 0
      },
      "ngXl": {
        "span": 8,
        "offset": 0
      },
      "nzXXl": {
        "span": 8,
        "offset": 0
      }
    },
    "controlSize": {
      "span": 16,
      "nzXs": 16,
      "nzSm": 16,
      "nzMd": 16,
      "nzLg": 16,
      "ngXl": 16,
      "nzXXl": 16
    }
  };
  constructor() { }


  ngOnInit(): void {
    if (this.config.componentConfig) {
      if (!this.config.componentConfig['labelSize']) {
        this.config.componentConfig['labelSize'] = this.itemConfig['labelSize'];
      }
      if (!this.config.componentConfig['controlSize']) {
        this.config.componentConfig['controlSize'] = this.itemConfig['controlSize'];
      }

    }
  }

}
