import { Component, Input, OnInit } from '@angular/core';
import { CfgFormDesignBase } from '../cfgFormDesignBase';

@Component({
  selector: 'app-cfg-form-textarea',
  templateUrl: './cfg-form-textarea.component.html',
  styles: [],
})
export class CfgFormTextareaComponent extends CfgFormDesignBase implements OnInit {
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
