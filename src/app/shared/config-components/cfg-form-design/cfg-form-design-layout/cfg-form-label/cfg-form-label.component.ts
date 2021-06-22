import { Component, Input, OnInit } from '@angular/core';
import { CfgFormDesignBase } from '../cfgFormDesignBase';

@Component({
  selector: 'app-cfg-form-label',
  templateUrl: './cfg-form-label.component.html',
  styles: [],
})
export class CfgFormLabelComponent extends CfgFormDesignBase implements OnInit {
  constructor() {
    super();
  }

  ngOnInit(): void {
    this.load();
    this.fromDataService.layoutStructInstance[this.l_config['id']] = this;
    if (this.config) {
      if (!this.config['labelSize']) {
        this.config['labelSize'] = this.itemConfig['labelSize'];
      }
      if (!this.config['controlSize']) {
        this.config['controlSize'] = this.itemConfig['controlSize'];
      }
    }
  }

  click(e?) {
    e.stopPropagation();
    this.selected();
  }
}
