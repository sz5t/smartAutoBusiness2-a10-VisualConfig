import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-cfg-page-cmpt-table',
  templateUrl: './cfg-page-cmpt-table.component.html',
  styles: [
  ]
})
export class CfgPageCmptTableComponent implements OnInit {
  @Input() public l_config;

  constructor() { }

  public tableColumns = [];
  public pageIndex = 1;
  public pageSize = 10;
  public total = 0;
  public pageSizeOptions = [10, 20]
  public showTotal: any;
  public isBordered: boolean = true;
  public size: string = 'default';

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
    ]
  }

  public dataList = [{
    name: "name",
    age: "age",
    sex: "sex",
  }]

  ngOnInit(): void {
    this._buildColumns(this.config.columns);
    this.load();
  }

  /**
   * 构建表格列集合
   * @param columns
   */
  private _buildColumns(columns) {
    debugger;
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
  public load() {

  }

}
