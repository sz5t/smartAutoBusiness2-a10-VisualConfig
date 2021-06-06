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
  body_style: any = { 'padding': '1px 2px' }
  body_style_selected: any = { 'padding': '1px 2px', 'border': "3px dashed red" }
  constructor() { }

  ngOnInit(): void {
    this.load();
    this.fromDataService.layoutStructInstance[this.l_config['id']] = this;
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
