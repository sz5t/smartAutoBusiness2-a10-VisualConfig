import { Component, Input, OnInit } from '@angular/core';
import { CfgFormDesignBase } from '../cfgFormDesignBase';

@Component({
  selector: 'app-cfg-form-select',
  templateUrl: './cfg-form-select.component.html',
  styles: [],
})
export class CfgFormSelectComponent extends CfgFormDesignBase implements OnInit {
  constructor() {
    super();
  }

  ngOnInit(): void {
    this.load();
    this.initLayout();
    // this.model = {
    //   label: `标签字段:[${this.config.labelName}], 取值字段:[${this.config.valueName}]`,
    //   value: this.config.valueName,
    // };
  }

  click(e?) {
    e.stopPropagation();
    this.selected();
  }
}
