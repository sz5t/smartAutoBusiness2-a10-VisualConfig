import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-cfg-form-input',
  template: '',
})
export class CfgFormDesignBase {
  @Input() public l_config;
  @Input() public showLayout: any;
  @Input() public selectedItem: any;
  @Input() public cmptState: any;
  @Input() public fromDataService;
  public config: any;
  public body_style: any = { padding: '1px 2px' };
  public body_style_selected: any = { padding: '1px 2px', border: '3px dashed red' };
  public itemConfig: any = {
    hiddenTitle: false,
    labelSize: {
      span: 8,
      nzXs: {
        span: 8,
        offset: 0,
      },
      nzSm: {
        span: 8,
        offset: 0,
      },
      nzMd: {
        span: 8,
        offset: 0,
      },
      nzLg: {
        span: 8,
        offset: 0,
      },
      ngXl: {
        span: 8,
        offset: 0,
      },
      nzXXl: {
        span: 8,
        offset: 0,
      },
    },
    controlSize: {
      span: 16,
      nzXs: 16,
      nzSm: 16,
      nzMd: 16,
      nzLg: 16,
      ngXl: 16,
      nzXXl: 16,
    },
  };
  public model: any | any[];
  initLayout() {
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

  selected() {
    this.selectedItem['item'] = this.l_config;
    this.selectedItem['active'] = this.l_config['type'];
    this.fromDataService.layoutNodeSelected(this.l_config);
    console.log('选中当前cnFormInput', this.selectedItem);
  }
}
