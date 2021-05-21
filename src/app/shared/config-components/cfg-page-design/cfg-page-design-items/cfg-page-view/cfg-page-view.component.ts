import { Component, Input, OnInit } from '@angular/core';
import { configFormDataServerService } from 'src/app/core/services/config/form-data.service';
import { CommonUtils } from 'src/app/core/utils/common-utils';

@Component({
  selector: 'app-cfg-page-view',
  templateUrl: './cfg-page-view.component.html',
  styles: [
  ]
})
export class CfgPageViewComponent implements OnInit {
  @Input() public showLayout;
  @Input() public cmptState;
  @Input() public selectedItem: any;

  @Input() public fromDataService: configFormDataServerService;
  l_config: any = {};
  constructor() { }

  ngOnInit(): void {

    this.fromDataService.layoutViewInstance = this;

  }

  layout_row = 2;
  layout_col = 2;
  layout_col_size = 12;

  layoutSourceData = {};

  CreateLayout() {

    let layout_id = CommonUtils.uuID(30);
    let layout_obj = {
      "id": layout_id,
      "key": layout_id,
      "type": "layout",
      "title": "【表单主对象】布局",
      "container": "rows",
      "expanded": true,
      "parentId": 'null'
    }
    this.layoutSourceData[layout_id] = layout_obj;

    this.l_config = {
      ...layout_obj,
      "children": this.CreateLayout_row(this.layout_row, layout_id)
    }

    this.fromDataService.layoutSourceData = this.layoutSourceData;

    this.fromDataService.layoutTreeInstance.layoutTree = [];
    this.fromDataService.layoutTreeInstance.layoutTree = [this.l_config];


  }

  CreateLayout_row(count?, pid?) {

    let rows = [];
    for (let i = 0; i < count; i++) {
      let row_id = CommonUtils.uuID(30);
      let row_obj = {
        "id": row_id,
        "key": row_id,
        "type": "row",
        "title": "行",
        "parentId": pid,
        "expanded": true,
        "showTitle": false,
        "container": "cols"
      }
      let r = {
        ...row_obj,
        "children": this.CreateLayout_col(this.layout_col, row_id),
      }
      this.layoutSourceData[row_id] = row_obj;
      rows.push(r);
    }
    return rows;

  }

  CreateLayout_col(count?, pid?) {
    let cols = [];
    for (let i = 0; i < count; i++) {

      let col_id = CommonUtils.uuID(30);
      let cmpt_obj = this.CreateLayout_component(col_id);
      let col_obj = {
        "id": col_id,
        "key": col_id,
        "type": "col",
        "title": "列",
        "parentId": pid,
        "expanded": true,
        "span": this.layout_col_size,
        "size": this.CreateLayout_col_size(this.layout_col_size),
        "container": "",
        children: []
      }
      let c = {
        ...col_obj,
        children: []
        // "children": [cmpt_obj]
      }
      this.layoutSourceData[col_id] = col_obj;
      cols.push(c);
    }
    return cols;
  }
  CreateLayout_component(pid?) {
    let cmpt_id = CommonUtils.uuID(30);
    let cmpt_obj = {
      "id": cmpt_id,
      "key": cmpt_id,
      "type": "form",
      "title": "明细项",
      "parentId": pid,
      "expanded": true
    }

    this.layoutSourceData[cmpt_id] = cmpt_obj;
    return cmpt_obj;


  }

  CreateLayout_col_size(size?) {

    let sizeObj = {
      "nzXs": size,
      "nzSm": size,
      "nzMd": size,
      "nzLg": size,
      "ngXl": size,
      "nzXXl": size
    }
    return sizeObj;

  }

}
