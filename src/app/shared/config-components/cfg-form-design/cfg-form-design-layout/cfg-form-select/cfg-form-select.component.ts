import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-cfg-form-select',
  templateUrl: './cfg-form-select.component.html',
  styles: [
  ]
})
export class CfgFormSelectComponent implements OnInit {

  @Input() public l_config;
  @Input() public showLayout: any;
  @Input() public selectedItem: any;
  @Input() public cmptState: any;
  @Input() public fromDataService;
  config;
  itemConfig: any = {
    hiddenTitle: false,
    "labelSize": {
      "span": 8,
      "nzXs": {
        "span": 8,
        "offset": 0
      },
      "nzSm": {
        "span": 8,
        "offset": 0
      },
      "nzMd": {
        "span": 8,
        "offset": 0
      },
      "nzLg": {
        "span": 8,
        "offset": 0
      },
      "ngXl": {
        "span": 8,
        "offset": 0
      },
      "nzXXl": {
        "span": 8,
        "offset": 0
      }
    },
    "controlSize": {
      "span": 16,
      "nzXs": 16,
      "nzSm": 16,
      "nzMd": 16,
      "nzLg": 16,
      "ngXl": 16,
      "nzXXl": 16
    }
  };
  body_style: any = { 'padding': '1px 2px' }
  body_style_selected: any = { 'padding': '1px 2px', 'border': "3px dashed red" }
  constructor() { }

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

  load() {
    this.config = this.fromDataService.layoutSourceData[this.l_config['id']];
    console.log('表单input', this.config);

  }

  click(e?) {
    e.stopPropagation();
    // this.optionState = true;
    // 选中
    this.selectedItem['item'] = this.l_config;
    this.selectedItem['active'] = 'cnFormSelect';
    this.fromDataService.layoutNodeSelected(this.l_config);
    console.log('选中当前cnFormInput', this.selectedItem);

  }

}
