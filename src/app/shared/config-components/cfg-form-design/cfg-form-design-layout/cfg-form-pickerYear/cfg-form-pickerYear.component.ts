import { Component, Input, OnInit } from '@angular/core';
import { CfgFormDesignBase } from '../cfgFormDesignBase';

@Component({
  selector: 'app-cfg-form-pickerYear',
  templateUrl: './cfg-form-pickerYear.component.html',
  styles: [],
})
export class CfgFormPickerYearComponent extends CfgFormDesignBase implements OnInit {
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
