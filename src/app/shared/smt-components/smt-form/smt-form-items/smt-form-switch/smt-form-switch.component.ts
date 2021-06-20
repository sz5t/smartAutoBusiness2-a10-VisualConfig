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
  public model: any;

  public on = 1;
  public off = 0;

  selectOptions: any = {
    check: {},
    close: {},
  };
  constructor() {}

  ngOnInit(): void {
    if (this.config.hasOwnProperty('off')) {
      this.off = this.config.off;
    }
    if (this.config.hasOwnProperty('on')) {
      this.on = this.config.on;
    }

    if (this.config.options) {
      this.config.options.forEach((element) => {
        if (element.type === 'check') {
          this.selectOptions.check = element;
        }
        if (element.type === 'close') {
          this.selectOptions.close = element;
        }
      });
      this.on = this.selectOptions.check.value;
      this.off = this.selectOptions.close.value;
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
