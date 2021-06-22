import { Component, Input, OnInit } from '@angular/core';
import { CfgFormDesignBase } from '../cfgFormDesignBase';

@Component({
  selector: 'app-cfg-form-pickerMonth',
  templateUrl: './cfg-form-pickerMonth.component.html',
  styles: [],
})
export class CfgFormPickerMonthComponent extends CfgFormDesignBase implements OnInit {
  constructor() {
    super();
  }

  ngOnInit(): void {
    this.load();
    this.initLayout();
  }

  click(e?) {
    e.stopPropagation();
    this.selected();
  }
}
