import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-smt-form-switch',
  templateUrl: './smt-form-switch.component.html',
  styles: [],
})
export class SmtFormSwitchComponent implements OnInit {
  @Input() validateForm: FormGroup;
  @Input() config;
  @Input() public fromDataService;
  public model = 1;

  public on = 1;
  public off = 0;

  public bindObj: {
    option: {
      check: any;
      close: any;
    };
  };

  constructor() {}

  private _initData() {
    this.bindObj = {
      option: {
        check: {},
        close: {},
      },
    };
  }

  ngOnInit(): void {
    this._initData();
    if (this.config.hasOwnProperty('off')) {
      this.off = this.config.off;
    }
    if (this.config.hasOwnProperty('on')) {
      this.on = this.config.on;
    }

    if (this.config.options) {
      this.config.options.forEach((element) => {
        if (element.type === 'check') {
          this.bindObj.option.check = element;
        }
        if (element.type === 'close') {
          this.bindObj.option.close = element;
        }
      });
      this.on = this.bindObj.option.check.value;
      this.off = this.bindObj.option.close.value;
    }
  }

  public switchValueChange(val) {
    if (val) {
      this.model = this.on;
    } else {
      this.model = this.off;
    }
  }
}
