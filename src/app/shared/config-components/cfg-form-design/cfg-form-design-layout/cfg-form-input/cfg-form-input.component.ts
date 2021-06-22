import { Component, Input, OnInit } from '@angular/core';
import { CfgFormDesignBase } from '../cfgFormDesignBase';

@Component({
  selector: 'app-cfg-form-input',
  templateUrl: './cfg-form-input.component.html',
  styles: [],
})
export class CfgFormInputComponent extends CfgFormDesignBase implements OnInit {
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

  changeIcon(type) {
    switch (type) {
      case 'email':
        return 'mail';
      case 'url':
        return 'link';
      case 'text':
        return 'edit';
      case 'number':
        return 'number';
      case 'password':
        return 'key';
      case 'hidden':
        return 'small-dash';
    }
  }
}
