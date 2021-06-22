import { Component, Input, OnInit } from '@angular/core';
import { CfgFormDesignBase } from '../cfgFormDesignBase';

@Component({
  selector: 'app-cfg-form-pickerDate',
  templateUrl: './cfg-form-pickerDate.component.html',
  styles: [],
})
export class CfgFormPickerDateComponent extends CfgFormDesignBase implements OnInit {
  constructor() {
    super();
  }

  ngOnInit(): void {
    this.load();
    this.initLayout();
    this.model = null;
  }

  click(e?) {
    e.stopPropagation();
    this.selected();
  }
}
