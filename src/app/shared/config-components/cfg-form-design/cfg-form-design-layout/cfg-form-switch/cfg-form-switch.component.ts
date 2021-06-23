import { Component, Input, OnInit } from '@angular/core';
import { CfgFormDesignBase } from '../cfgFormDesignBase';

@Component({
  selector: 'app-cfg-form-switch',
  templateUrl: './cfg-form-switch.component.html',
  styles: [],
})
export class CfgFormSwitchComponent extends CfgFormDesignBase implements OnInit {
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
