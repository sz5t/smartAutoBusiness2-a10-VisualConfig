import { Component, Input, OnInit } from '@angular/core';
import { CfgFormDesignBase } from '../cfgFormDesignBase';

@Component({
  selector: 'app-cfg-form-check',
  templateUrl: './cfg-form-check.component.html',
  styles: [],
})
export class CfgFormCheckComponent extends CfgFormDesignBase implements OnInit {
  constructor() {
    super();
  }

  ngOnInit(): void {
    this.load();
    this.initLayout();
    this._initData();
    if (this.config.staticData) {
      this.model = this.config.staticData;
    }
  }

  click(e?) {
    e.stopPropagation();
    this.selected();
  }

  private _initData() {
    this.model = [
      { label: '选项1', value: '' },
      { label: '选项2', value: '' },
    ];
  }
}
