import { Component, Input, OnInit } from '@angular/core';
import { configFormDataServerService } from 'src/app/core/services/config/form-data.service';
import { CommonUtils } from 'src/app/core/utils/common-utils';

@Component({
  selector: 'app-cfg-page-cmpt-table',
  templateUrl: './cfg-page-cmpt-table.component.html',
  styles: [
  ]
})
export class CfgPageCmptTableComponent implements OnInit {
  @Input() public l_config;
  @Input() public showLayout: any;
  @Input() public selectedItem: any;
  @Input() public cmptState: any;
  @Input() public fromDataService: configFormDataServerService;

  constructor() { }

  public tableColumns = [];
  public pageIndex = 1;
  public pageSize = 10;
  public total = 0;
  public pageSizeOptions = [10, 20]
  public showTotal: any;
  public isBordered: boolean = true;
  public title;
  public scroll;
  public size: string = 'default';
  public isAllChecked = false;
  public indeterminate;
  public checkedNumber;

  public config = {
    columns: [
      {
        "title": "标题一",
        "titleAlign": "left",
        "showSort": false,  // 是否可排序
        "type": "field",
        "field": "name",
        "hidden": false,
        "width": "30%",
      },
      {
        "title": "标题二",
        "titleAlign": "left",
        "showSort": false,  // 是否可排序
        "type": "field",
        "field": "age",
        "hidden": false,
        "width": "30%",
      },
      {
        "title": "标题三",
        "titleAlign": "left",
        "showSort": false,  // 是否可排序
        "type": "field",
        "field": "sex",
        "hidden": false,
        "width": "30%",
      }
    ],
    showCheckBox: false,
    showCheckBoxConfig: {
      offsetLeft: false
    }
  }

  public dataList = [{
    name: "name",
    age: "age",
    sex: "sex",
  }]
  body_style: any = { 'padding': '1px 2px' }
  body_style_selected: any = { 'padding': '1px 2px', 'border': "3px dashed red" }
  ngOnInit(): void {
    this.load();
    this.fromDataService.layoutStructInstance[this.l_config['id']] = this;

  }



  /**
   * 构建表格列集合
   * @param columns
   */
  private _buildColumns(columns) {
    // debugger;
    if (Array.isArray(columns) && columns.length > 0) {
      const colIndex = columns.filter((item) => item.type === 'index');
      const colObjs = columns.filter((item) => item.type === 'field');
      const actionCfgs = columns.filter((item) => item.type === 'action');
      // colObjs.forEach((col) => {
      //   if (col.editor) {
      //     if (col.editor.loadingConfig) {
      //       col.editor.loadingConfig.ajaxConfig = this._ajaxConfigObj[col.editor.loadingConfig.id];
      //     }
      //     if (col.editor.loadingItemConfig) {
      //       col.editor.loadingItemConfig.ajaxConfig = this._ajaxConfigObj[col.editor.loadingItemConfig.id];
      //     }
      //     if (col.editor.expandConfig) {
      //       col.editor.expandConfig.ajaxConfig = this._ajaxConfigObj[col.editor.expandConfig.id];
      //     }
      //     if (col.editor.hasOwnProperty('changeValueId')) {
      //       col.editor.changeValue = this.findChangeValueConfig(col.editor.changeValueId);
      //     }
      //   }
      // });
      // if (actionCfgs && actionCfgs.length > 0) {
      //   actionCfgs.map((cfg) => {
      //     const colActions = [];
      //     cfg.actionIds.map((actionId) => {
      //       const act = this.RowActions.find((action) => actionId === action.id);
      //       if (act) {
      //         colActions.push(act);
      //       }
      //     });
      //     if (colActions.length > 0) {
      //       cfg.action = colActions;
      //     }
      //   });
      // }
      if (colIndex && colIndex.length > 0) {
        this.tableColumns.push(...colIndex);
      }
      if (colObjs && colObjs.length > 0) {
        this.tableColumns.push(...colObjs);
      }
      if (actionCfgs && actionCfgs.length > 0) {
        this.tableColumns.push(...actionCfgs);
      }
    }
  }

  // 根据传入配置读取表格内容方法

  load() {
    this.config = this.fromDataService.layoutSourceData[this.l_config['id']];
    if (this.config && this.config.columns) {
      this._buildColumns(this.config.columns);
      console.log('tableConfig', this.config);
    }

  }

  public searchData() {

  }

  click(e?) {
    e.stopPropagation();
    // this.optionState = true;
    // 选中
    this.selectedItem['item'] = this.l_config;
    this.selectedItem['active'] = 'cnDataTable';
    this.fromDataService.layoutNodeSelected(this.l_config);
    console.log('选中当前tabs', this.selectedItem);

  }

  public f_ondrop(e?, d?) {

    e.preventDefault();
    console.log('拖动行ondrop', e, d);
    const ss = e.dataTransfer.getData('test');
    console.log('拖动行ondrop临时值', ss);
    let dropData = JSON.parse(ss);
    // console.log('拖拽JSON', dropData);

    let dropName = dropData['dropName'];
    if (dropData['dropName'] === 'cnToolbar') {
      const cmpTypeMapping = {
        cnForm: 'cnForm',
        cnTable: 'cnDataTable',
        cnTree: 'cnTree',
        cnTreeTable: 'cnTreeTable',
        cnToolbar: 'cnToolbar',
        tabs: 'tabs'
      }

      if (!cmpTypeMapping[dropName]) {
        e.stopPropagation();
        return;
      }

      let cmptObj = {
        "type": cmpTypeMapping[dropName],
        "title": "组件" + cmpTypeMapping[dropName],
        "container": cmpTypeMapping[dropName],
        "positionId": this.l_config['id']
      }

      // this.l_config.children = [];

      this.l_config['container'] = 'component';
      let node = this.fromDataService.l_create_component(this.l_config['id'], cmptObj);
      // this.l_config.children.splice(0, 0, node);
      this.fromDataService.layoutTreeInstance.addChildrenNode(this.l_config['id'], node, 0);

      e.stopPropagation();
    }
  }

  addRowToolbar(d?) {


    let ss = 'cnRowToolbar';
    if (ss === 'cnRowToolbar') {
      const cmpTypeMapping = {
        cnRowToolbar: 'cnRowToolbar'
      }

      if (!cmpTypeMapping[ss]) {

        return;
      }

      let cmptObj = {
        "type": cmpTypeMapping[ss],
        "title": "组件" + cmpTypeMapping[ss],
        "container": cmpTypeMapping[ss],
        "positionId": d['id']
      }

      // this.l_config.children = [];

      this.l_config['container'] = 'component';
      let node = this.fromDataService.l_create_component(this.l_config['id'], cmptObj);
      // this.l_config.children.splice(0, 0, node);
      this.fromDataService.layoutTreeInstance.addChildrenNode(this.l_config['id'], node, 0);


    }

  }

  getRowToolbar(col) {
    let back = true;

    const index = this.l_config['children'].findIndex((item) => item['positionId'] === col.id);
    if (index > -1) {
      back = false;
    }
    return back;
  }

}
