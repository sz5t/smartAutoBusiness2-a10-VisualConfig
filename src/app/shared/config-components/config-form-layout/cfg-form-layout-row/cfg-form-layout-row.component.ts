import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { configFormDataServerService } from 'src/app/core/services/config/form-data.service';
import { CommonUtils } from 'src/app/core/utils/common-utils';

@Component({
  selector: 'cfg-form-layout-row',
  templateUrl: './cfg-form-layout-row.component.html',
  // styleUrls: ['./cfg-form-layout-row.component.css'],
  styles: [
    `

    .ant-card-head {
      min-height: 28px;
    }
    .ant-card-head-title {
      padding: 2px 0;
    }
    .ant-card-extra {
      padding: 2px 0;
    }

  `
  ]
})
export class CfgFormLayoutRowComponent implements OnInit {

  @Input() public l_config;
  @Input() public showLayout: any;
  @Input() public selectedItem: any;
  @Input() public cmptState: any;
  @Input() public fromDataService: configFormDataServerService;
  @Output() public layoutOptions = new EventEmitter();
  constructor() { }

  public config: any;
  optionState = false;
  body_style: any = { 'padding': '1px 2px' }
  body_style_selected: any = { 'padding': '1px 2px', 'border': "3px dashed red" }
  ngOnInit(): void {

    this.config = this.fromDataService.layoutSourceData[this.l_config['id']];
  }


  del() {
    let op = { type: 'del', data: this.l_config };
    this.layoutOptions.emit(op);
  }

  is_move = false;
  mousemove(e?) {

    // console.log('鼠标移入');
    // e.stopPropagation();
    if (!this.is_move)
      setTimeout(() => {
        this.optionState = true;
        this.is_move = true;
      }, 300);


  }
  mouseout(e?) {

    // console.log('鼠标移出');
    e.stopPropagation();
    // if (this.is_move)
    setTimeout(() => {
      this.optionState = false;
      this.is_move = false;
    }, 300);


  }


  click(e?) {

    this.optionState = true;
    // 选中
    this.selectedItem['rowitem'] = this.l_config;
    this.selectedItem['active'] = 'row';
    this.fromDataService.layoutNodeSelected(this.l_config);
    console.log('选中当前行', this.selectedItem);

  }


}
