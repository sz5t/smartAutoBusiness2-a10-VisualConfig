import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-smt-data-table',
  templateUrl: './smt-data-table.component.html',
  styles: [
    `.selectedRow {
      color: #000;
      background-color: rgba(232, 249, 243);
    }`
  ]
})
export class SmtDataTableComponent implements OnInit {

  constructor() { }
  @Input() public config; // dataTables 的配置参数
  @Input() public initData;
  @Input() public tempData;
  @Input() public dataServe;

  public dataList: any[] = [ // 数据源数组
    {
      ID: '1',
      NAME: '张三',
      AGE: 20
    },
    {
      ID: '2',
      NAME: "李四",
      AGE: 22
    }
  ]
  public pageIndex = 1;
  public pageSize: number;
  public total = 0;
  public showTotal: boolean;
  public mapOfDataState: {
    [key: string]: {
      disabled: boolean;
      checked: boolean;
      selected: boolean;
      state: string;
      data: any;
      originData: any;
      actions?: any[];
      validation?: boolean;
      mergeData?: any;
      style?: any;
    };
  } = {};
  public checkedNumber = 0;
  public RowActions: any;
  public tableColumns: any = [];
  public pageSizeOptions: any = [];

  public KEY_ID: string;
  public isAllChecked = false;
  public indeterminate = false;

  public ROW_SELECTED: any;
  public ROWS_CHECKED: any[] = [];

  public async ngOnInit() {
    // console.log(this.config);
    // console.log(this.initData);
    // console.log(this.tempData);
    // console.log(this.dataServe);
    this.KEY_ID = this.config.keyId ? this.config.keyId : 'ID';
    this.pageSize = this.config.pageSize ? parseInt(this.config.pageSize) : 10;
    this.pageSizeOptions = [10, 20, 50, 100];
    this.showTotal = this.config.showTotal ? this.config.showTotal : false;
    this._buildColumns(this.config.columns, this.config);
    console.log(this.config, this.tableColumns);

    // 是否需要进行初始化数据加载
    if (this.config.loadingOnInit) {
      // await this.load();
      this.total = this.dataList.length;
    }

    this.createTableMapping();
  }

  private _buildColumns(columns, cfg) {

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
      if (actionCfgs && actionCfgs.length > 0) {
        actionCfgs.map((action) => {
          const colActions = [];
          cfg.children.forEach(toolbar => {
            if (action['id'] === toolbar['positionId']) {
              colActions.push(toolbar)
            }
          });
          if (colActions.length > 0) {
            action.children = colActions;
          }
        });
      }
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

  public createTableMapping() {
    this.dataList.forEach(d => {
      this.mapOfDataState[d[this.KEY_ID]] = {
        disabled: false,
        checked: false, // index === 0 ? true : false,
        selected: false, // index === 0 ? true : false,
        state: 'text',
        data: d,
        originData: { ...d },
        validation: true,
        actions: this.config.children,
        mergeData: {},
        style: null,
      };
    });
    // console.log(this.mapOfDataState);
  }

  public dataCheckedStatusChange() {
    if (this.dataList.length > 0) {
      this.isAllChecked = this.dataList
        .filter((item) => !this.mapOfDataState[item[this.KEY_ID]].disabled)
        .every((item) => this.mapOfDataState[item[this.KEY_ID]].checked);

      this.indeterminate =
        this.dataList
          .filter((item) => !this.mapOfDataState[item[this.KEY_ID]].disabled)
          .some((item) => this.mapOfDataState[item[this.KEY_ID]].checked) && !this.isAllChecked;

      this.checkedNumber = this.dataList.filter((item) => this.mapOfDataState[item[this.KEY_ID]].checked).length;

      // 更新当前选中数据集合
      this.ROWS_CHECKED = this.dataList
        .filter((item) => !this.mapOfDataState[item[this.KEY_ID]].disabled)
        .filter((item) => this.mapOfDataState[item[this.KEY_ID]].checked);
    } else {
      this.isAllChecked = false;
      this.indeterminate = false;
      this.checkedNumber = 0;
    }

    return true;
  }

  public setSelectRow(rowData?, $event?) {
    if ($event) {
      const src = $event.srcElement || $event.target;
      if (src.type !== undefined) {
        return false;
      }
      $event.stopPropagation();
      $event.preventDefault();
    }
    if (!rowData.hasOwnProperty(this.KEY_ID)) {
      if (this.dataList.length > 0) {
        this.dataList.map((row) => {
          this.mapOfDataState[row[this.KEY_ID]].selected = false;
          this.mapOfDataState[row[this.KEY_ID]].checked = false;
        });

        const key = this.dataList[0][this.KEY_ID];
        this.mapOfDataState[key].selected = true;
        this.mapOfDataState[key].checked = true;
        //  勾选/取消当前行勾选状态

        this.dataCheckedStatusChange();
      }
      //  return false;
    } else {
      this.ROW_SELECTED = rowData;

      //  选中当前行
      if (this.dataList.length > 0) {
        this.dataList.map((row) => {
          this.mapOfDataState[row[this.KEY_ID]].selected = false;
          this.mapOfDataState[row[this.KEY_ID]].checked = false;
        });

        if (rowData[this.KEY_ID] && rowData[this.KEY_ID].length > 0) {
          this.mapOfDataState[rowData[this.KEY_ID]].selected = true;
          this.mapOfDataState[rowData[this.KEY_ID]].checked = true; //  !this.mapOfDataState[rowData[this.KEY_ID]]['checked'];
        }

        //  勾选/取消当前行勾选状态

        this.dataCheckedStatusChange();
      }
    }
    return true;
  }

  public checkAll($value: boolean): void {
    //
    this.dataList
      .filter((item) => !this.mapOfDataState[item[this.KEY_ID]].disabled)
      .map((item) => (this.mapOfDataState[item[this.KEY_ID]].checked = $value));
    this.dataCheckedStatusChange();
  }

  searchData(reset: boolean = false) {
    if (reset) {
      this.pageIndex = 1;
    }
    this.isAllChecked = false;
    this.indeterminate = false;
    // this.load();
  }

}
