import { Component, Input, OnInit, EventEmitter, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { configFormDataServerService } from 'src/app/core/services/config/form-data.service';

@Component({
  selector: 'app-cn-static-form-select',
  templateUrl: './cn-static-form-select.component.html',
  styles: [
  ]
})
export class CnStaticFormSelectComponent implements OnInit {
  @Input() validateForm: FormGroup;
  @Input() config;
  @Input() public fromDataService: configFormDataServerService;
  @Output() public updateValue = new EventEmitter<any>(true);
  @Output() public cascadeValue = new EventEmitter<any>(true);
  selectValue: any;
  selectOptions: any[];
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
    console.log('select:', this.config);
    if (this.config['componentConfig']) {
      this.selectOptions = this.config['componentConfig']['options'];
      if (!this.config.componentConfig['labelSize']) {
        this.config.componentConfig['labelSize'] = this.itemConfig['labelSize'];
      }
      if (!this.config.componentConfig['controlSize']) {
        this.config.componentConfig['controlSize'] = this.itemConfig['controlSize'];
      }
    }

    if (this.validateForm.controls[this.config['name']]) {
      let d = this.validateForm.controls[this.config['name']].value;
      if (this.config['componentConfig']['casadeValue']) {
        this.text(d);
      }
    }


  }

  log(v?) {
    this.selectValue = v;
    if (this.config['componentConfig']['casadeValue']) {
      this.text(v);
    }
    console.log('选择中：', v);
  }

  public text(v) {

    let back = { name: this.config.name, data: v, cascadeValueObj: this.config['componentConfig']['casadeValue'] }

    this.cascadeValue.emit(back);

  }


}
