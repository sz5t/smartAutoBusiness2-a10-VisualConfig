import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-cn-static-form-slider',
  templateUrl: './cn-static-form-slider.component.html',
  styles: [
  ]
})
export class CnStaticFormSliderComponent implements OnInit {
  @Input() validateForm: FormGroup;
  @Input() config;
  @Input() public fromDataService;
  @Output() public updateValue = new EventEmitter<any>(true);
  componentConfig: any = {};
  selectValue: any;
  showValue: any;
  constructor() { }
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
  ngOnInit(): void {

    console.log('select:', this.config);
    if (this.config['componentConfig']) {
      this.componentConfig = this.config['componentConfig'];

    }
    if (this.config.componentConfig) {
      if (!this.config.componentConfig['labelSize']) {
        this.config.componentConfig['labelSize'] = this.itemConfig['labelSize'];
      }
      if (!this.config.componentConfig['controlSize']) {
        this.config.componentConfig['controlSize'] = this.itemConfig['controlSize'];
      }

    }
    if (!this.componentConfig.hasOwnProperty('min')) {
      this.componentConfig['min'] = 0;
    }
    if (!this.componentConfig.hasOwnProperty('max')) {
      this.componentConfig['max'] = 100;
    }
    this.loadShowValue();
  }
  loadShowValue() {
    let d = this.validateForm.controls[this.config['name']].value;

    this.showValue = d;

  }
  log(v) {
    console.log('sider', v);
    this.validateForm.controls[this.config['name']].markAsDirty();
    if (v !== this.showValue) {
      this.loadShowValue();
    }
  }
  valueChange(v?) {
    this.validateForm.get(this.config['name'])!.setValue(v);
  }

}
