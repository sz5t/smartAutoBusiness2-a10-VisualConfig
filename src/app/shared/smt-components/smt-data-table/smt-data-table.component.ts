import { Component, Inject, Input, OnInit, Output } from '@angular/core';
import { ComponentServiceProvider } from 'src/app/core/services/components/component.service';
import { BSN_COMPONENT_SERVICES } from 'src/app/core/relations/bsn-relatives';
import { SmtComponentBase } from '../smt-component.base';
import { SmtDataTableAdapter } from './smt-table-adapter';
import { CommonUtils } from 'src/app/core/utils/common-utils';
import { environment } from '@env/environment';
import { XlsxService } from '@delon/abc/xlsx';
import { SmtParameterResolver } from '../../resolver/smt-parameter/smt-parameter-resolver';
import { Content } from '@angular/compiler/src/render3/r3_ast';
import { Subject, Subscription } from 'rxjs';
import { CN_DATA_GRID_METHOD } from 'src/app/core/relations/bsn-methods';
import { SmtEventResolver } from '../../resolver/smt-event/smt-event-resolver';
import { SmtCommandResolver } from '../../resolver/smt-command/smt-command.resovel';
import { SmtMessageSenderResolver } from '../../resolver/smt-relation/smt-relation-resolver';
import EventEmitter from 'wolfy87-eventemitter';

@Component({
  selector: 'app-smt-data-table',
  templateUrl: './smt-data-table.component.html',
  styles: [
    `
      .selectedRow {
        color: #000;
        background-color: rgba(232, 249, 243);
      }
    `,
  ],
})
export class SmtDataTableComponent extends SmtComponentBase implements OnInit {
  constructor(
    @Inject(BSN_COMPONENT_SERVICES)
    public componentService: ComponentServiceProvider,
  ) {
    super(componentService);
    this.INIT_VALUE = {};
    this.TEMP_VALUE = {};
    this.CHECKED_ITEMS_IDS = {};
    this.SELECTED_ITEM = {};
    this.ADDED_ITEMS = [];
    this.EDITED_ITEMS = [];
    this.KEY_ID = '';
    this.dataSourceCfg = {};
    this.COMPONENT_METHODS = CN_DATA_GRID_METHOD;
    this.CACHE_VALUE = this.componentService.cacheService;
    this.IS_LOADING = false
  }
  @Input() public config; // dataTables 的配置参数
  @Input() public initData;
  @Input() public tempData;
  @Input() public dataServe;
  @Output() public updateValue = new EventEmitter();

  public dataList: any[] = [
    // 数据源数组
  ];
  public _sortName;
  public _sortValue;
  public xlsx;
  public _url = environment.SERVER_URL;
  public bindObj: any = {};
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
  public isAllChecked = false;
  public indeterminate = false;

  public ROW_SELECTED: any;
  public ROWS_CHECKED: any[] = [];

  public commandList: any[];

  formCascade = {};

  private _sender_source$: Subject<any>;
  private _sender_subscription$: Subscription;

  public async ngOnInit() {
    // 解析对应的组件配置
    this.createTableConfig(this.config);

    console.log(this.bindObj);

    // 初始化组件值
    this.initComponentValue();

    // 初始化配置属性
    this.initProperty();

    // 是否需要进行初始化数据加载
    if (this.dataSourceCfg['loadingOnInit'] === true) {
      await this.load();
    }
    // 初始化解析表个的内容：命令，行为，消息
    this.initAnalysis();
  }

  public initAnalysis() {
    // 解析行为
    this.createEvent();
    // 解析命令
    this.createCommandList();
    // 解析消息
    // this.analysisEvent();
  }

  public createEvent() {
    if (this.bindObj.eventConent.length > 0) {
      this._sender_source$ = new SmtEventResolver(this).resolve(this.bindObj.eventConent);
      this._sender_subscription$ = this._sender_source$.subscribe();
    }
  }
  public createCommandList() {
    if (this.bindObj['customCommand'].length > 0) {
      new SmtCommandResolver(this).resolve(this.bindObj['customCommand']);
    }
  }

  public sendCommand() {
    const resObj = this.createCommandUrl('sendCommand');
    // 发送命令
    for (let i = 0; i < resObj.commandConfig.length; i++) {
      new SmtMessageSenderResolver(this).resolve(resObj.commandConfig[i]);
      // 执行命令发送后置
      if (resObj.result && resObj.result.length > 0) {
        resObj.result.forEach((result) => {
          new SmtCommandResolver(this).afterOperate(result, this.componentService.modalService);
        });
      }
    }
  }

  public createTableConfig(cfg) {
    const newConfig = new SmtDataTableAdapter();
    this.bindObj = newConfig.transformConfigToDataTbale(cfg);
  }

  public initComponentValue() {
    if (this.tempData) {
      this.TEMP_VALUE = this.tempData;
    } else {
      this.TEMP_VALUE = {};
    }
    if (this.initData) {
      this.TEMP_VALUE = this.initData;
    } else {
      this.TEMP_VALUE = {};
    }
  }

  public initProperty() {
    this.KEY_ID = this.bindObj.keyId;
    this.pageSize =
      typeof this.bindObj.pageSize === 'string' ? parseInt(this.bindObj.pageSize) : this.bindObj.pageSize;
    this.pageSizeOptions = this.bindObj.pageSizeOptions;
    this.showTotal = this.bindObj.showTotal;
    this.dataSourceCfg = {
      loadingOnInit: this.bindObj.hasOwnProperty('loadingOnInit') ? this.bindObj.loadingOnInit : false,
      async: this.bindObj.hasOwnProperty('async') ? this.bindObj.async : false,
      loadingConfig: {
        id: this.bindObj.mainSource.hasOwnProperty('id') ? this.bindObj.mainSource.id : 'loading',
        // 请求地址，inner 匹配的后台地址
        urlType: this.bindObj.mainSource.hasOwnProperty('urlType') ? this.bindObj.mainSource.urlType : 'inner',
        // 适配外部请求
        urlContent: this.bindObj.mainSource.hasOwnProperty('urlContent') ? this.bindObj.mainSource.urlContent : {},
        url: this.bindObj.mainSource.hasOwnProperty('url') ? this.bindObj.mainSource.url : '',
        ajaxType: this.bindObj.mainSource.hasOwnProperty('ajaxType') ? this.bindObj.mainSource.ajaxType : '',
        // 头部参数
        headParams: this.bindObj.mainSource.headParams.length > 0 ? this.bindObj.mainSource.headParams : [],
        // 路径参数
        pathParams: this.bindObj.mainSource.pathParams.length > 0 ? this.bindObj.mainSource.pathParams : [],
        // 查询参数
        queryParams: this.bindObj.mainSource.queryParams.length > 0 ? this.bindObj.mainSource.queryParams : [],
        // 请求体参数
        bodyParams: this.bindObj.mainSource.bodyParams.length > 0 ? this.bindObj.mainSource.bodyParams : [],
      },
    };
    this._buildColumns(this.bindObj.columns, this.bindObj);
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
          cfg.children.forEach((toolbar) => {
            if (action['id'] === toolbar['positionId']) {
              colActions.push(toolbar);
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
    this.dataList.forEach((d) => {
      this.mapOfDataState[d[this.KEY_ID]] = {
        disabled: false,
        checked: false, // index === 0 ? true : false,
        selected: false, // index === 0 ? true : false,
        state: 'text',
        data: d,
        originData: { ...d },
        validation: true,
        actions: this.bindObj.children,
        mergeData: {},
        style: null,
      };
    });
    console.log(this.mapOfDataState);
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

      // 更新勾选的IDS
      this.CHECKED_ITEMS_IDS = this.createIds(this.ROWS_CHECKED);
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
      this.SELECTED_ITEM = rowData;

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

  public createIds(array) {
    let ids = '';
    const checkedIdsObj = { IDS: '' };
    if (array.length > 0) {
      for (let i = 0; i < array.length; i++) {
        if (i === 0) {
          ids = array[i][this.KEY_ID];
        } else {
          ids = ids + ',' + array[i][this.KEY_ID];
        }
      }
      checkedIdsObj['IDS'] = ids;
    }
    return checkedIdsObj;
  }

  searchData(reset: boolean = false) {
    if (reset) {
      this.pageIndex = 1;
    }
    this.isAllChecked = false;
    this.indeterminate = false;
    this.load();
  }

  public async load() {
    this.IS_LOADING = true;
    let response: any;
    // if (iden) {
    if (!this.dataSourceCfg.loadingConfig) {
      return;
    }
    if (!this.bindObj['isPagination']) {
      response = await this.executeHttp(this.dataSourceCfg['loadingConfig'], null, null);
    } else {
      response = await this.executeHttp(this.dataSourceCfg['loadingConfig'], null, 'paging');
    }

    this.dataList = response.data.resultDatas;
    this.total = response.data.count;

    this.createTableMapping();
    this.initSelectedRow();
    this.IS_LOADING = false;

    return this.getExecuteResult(response, false);
  }

  public _buildPaging() {
    const params: any = {};
    if (this.bindObj.isPagination) {
      params._page = this.pageIndex;
      params._rows = this.pageSize;
    }
    return params;
  }

  public _buildSort() {
    const sortObj: any = {};
    // if (this._sortName && this._sortType) {
    if (this._sortName && this._sortValue) {
      let sortValue = '';
      if (this._sortValue === 'ascend') {
        sortValue = 'asc';
      }
      if (this._sortValue === 'descend') {
        sortValue = 'desc';
      }
      sortObj._sort = this._sortName + ' ' + sortValue;
      // sortObj['_order'] = sortObj['_order'] ? 'DESC' : 'ASC';
    }
    return sortObj;
  }

  public _buildFilter(filterConfig) {
    let filter = {};
    if (filterConfig) {
      filter = SmtParameterResolver.resolve({
        params: filterConfig,
        tempValue: this.TEMP_VALUE,
        cacheValue: this.CACHE_VALUE,
        initValue: this.INIT_VALUE,
        userValue: this.USER_VALUE,
      });
    }
    return filter;
  }

  public initSelectedRow() {
    if (this.dataList.length > 0) {
      this.setSelectRow(this.dataList[0]);
    }
  }

  // 有操作之后的刷新方法
  public loadRefreshData(option) {
    if (this.dataSourceCfg.loadingConfig) {
      this.executeHttp(this.dataSourceCfg.loadingConfig, 'buildParameters', 'paging').then(
        (response) => {
          if (response && response.data && response.data) {
            this.refreshData(response.data.resultDatas);
          } else {
          }
        },
        (error) => {
          console.log(error);
        },
      );
    }
  }

  public refreshData(loadNewData) {
    if (loadNewData && Array.isArray(loadNewData)) {
      loadNewData.map((newData, ind) => {
        const index = this.dataList.findIndex((d) => d[this.KEY_ID] === newData[this.KEY_ID]);
        if (index > -1) {
          this.dataList.splice(index, 1, newData);
          this.dataList = [...this.dataList];
        } else {
          this.dataList = [loadNewData[ind], ...this.dataList];
        }

        // liu 20200818 处理编辑一次后不可编辑，刷新将状态恢复

        // liu 20200525
        const mapData = this.mapOfDataState[newData[this.KEY_ID]];
        if (mapData) {
          mapData.state = 'text';
          mapData.actions = this.getRowActions('text');
          mapData.data = newData;
          mapData.originData = { ...newData };
        } else {
          // 组装状态数据
          this.mapOfDataState[newData[this.KEY_ID]] = {
            data: newData,
            originData: { ...newData },
            disabled: false,
            checked: true, // index === 0 ? true : false,
            selected: false, // index === 0 ? true : false,
            state: 'text',
            validation: true,
            actions: this.getRowActions('text'),
            mergeData: {},
          };
        }

        this.rows_Add_Edit(newData);
      });
    }
    // 刷新dataList
    // 刷新mapOfDataState

    this.dataList.forEach((item, idx) => {
      this.mapOfDataState[item[this.KEY_ID]].originData._index = idx + 1;
      // item[this.KEY_ID]
      item._index = idx + 1;
    });
    // liu 20200818
    this.dataCheckedStatusChange();
  }

  public getRowActions(state): any[] {
    const orginAction = this.tableColumns.find((c) => c.type === 'action');
    const copyAction = [];
    if (orginAction) {
      if (this.tableColumns.find((c) => c.type === 'action').action) {
        // const actions = JSON.parse(
        //   JSON.stringify(this.tableColumns.find((c) => c.type === 'action').action.filter((c) => c.state === state)),
        // );
        const actions = this.tableColumns.find((c) => c.type === 'action').action.filter((c) => c.state === state);
        copyAction.push(...actions);
      }
    }
    return copyAction;
  }

  public rows_Add_Edit(item?) {
    this.ADDED_ITEMS = this.ADDED_ITEMS.filter((r) => r[this.KEY_ID] !== item[this.KEY_ID]);
    this.EDITED_ITEMS = this.EDITED_ITEMS.filter((r) => r[this.KEY_ID] !== item[this.KEY_ID]);
    // this.dataCheckedStatusChange();
  }

  // 添加行
  public addRow(r?) {
    // 创建空数据对象
    const newId = CommonUtils.uuID(36);
    let newData = this.createNewRowData();
    newData[this.KEY_ID] = newId;
    if (r) {
      newData = { ...newData, ...r };
    }

    // 新增数据加入原始列表,才能够动态新增一行编辑数据
    this.dataList = [newData, ...this.dataList];
    this.total = this.total + 1;

    // 组装状态数据
    this.mapOfDataState[newId] = {
      data: newData,
      originData: { ...newData },
      disabled: false,
      checked: true, // index === 0 ? true : false,
      selected: false, // index === 0 ? true : false,
      state: 'new',
      actions: this.getRowActions('new'),
      mergeData: {},
    };

    this.ADDED_ITEMS = [newData, ...this.ADDED_ITEMS];

    this.dataCheckedStatusChange();
    // this.setSelectRow(newData);

    // 更新状态
  }

  private createNewRowData() {
    const newData = {};
    this.bindObj.columns.map((col) => {
      newData[col.field] = null;
    });
    return newData;
  }

  private removeEditRow(item) {
    this.EDITED_ITEMS = this.EDITED_ITEMS.filter((r) => r[this.KEY_ID] !== item[this.KEY_ID]);
    this.dataCheckedStatusChange();
  }

  public editRow(option) {
    // console.log('edit====', option);
    if (option) {
      this.addEditRows(option);
      this.startToEdit(option);
      // 2020.7.27 计算合并列
      // if (this.config.mergeconfig) {
      //   this._createMapd_new(this.config.mergeconfig, this.dataList);
      // }
    }
    return true;
  }

  private startToEdit(option) {
    this.mapOfDataState[option[this.KEY_ID]].state = 'edit';
  }

  public editRows(option) {
    this.ROWS_CHECKED.map((item) => {
      this.addEditRows(item);
      // const trigger = new ButtonOperationResolver(this.componentService, this.config, this.mapOfDataState[item[this.KEY_ID]]);
      // trigger.sendBtnMessage(
      //   option.btnCfg,
      //   { triggerType: BSN_TRIGGER_TYPE.STATE, trigger: BSN_DATAGRID_TRIGGER.EDIT_ROW },
      //   this.config.id,
      // );
    });
  }

  private addEditRows(item) {
    const index = this.EDITED_ITEMS.findIndex((r) => r[this.KEY_ID] === item[this.KEY_ID]);
    if (index < 0) {
      this.EDITED_ITEMS = [item, ...this.EDITED_ITEMS];
    }
  }

  // 取消添加的新行 数据
  public cancelNewRow(option) {
    if (option.data) {
      this.removeNewRow(option.data.data);
    }
    this.dataCheckedStatusChange();
  }

  public cancelNewRows(option) {
    this.ADDED_ITEMS.map((item) => {
      this.removeNewRow(item);
      // const trigger = new ButtonOperationResolver(this.componentService, this.config, this.mapOfDataState[item[this.KEY_ID]]);
      // trigger.sendBtnMessage(
      //   option.btnCfg,
      //   { triggerType: BSN_TRIGGER_TYPE.STATE, trigger: BSN_DATAGRID_TRIGGER.CANCEL_EDIT_ROW },
      //   this.config.id,
      // );
    });
    this.dataCheckedStatusChange();
    return true;
  }

  private removeNewRow(item) {
    this.dataList = this.dataList.filter((r) => r[this.KEY_ID] !== item[this.KEY_ID]);
    this.ADDED_ITEMS = this.ADDED_ITEMS.filter((r) => r[this.KEY_ID] !== item[this.KEY_ID]);
    delete this.mapOfDataState[item[this.KEY_ID]];
    if (this.total > 0) {
      this.total = this.total - 1;
    }
    // 2020.7.27 计算合并列
    // if (this.config.mergeconfig) {
    //   this._createMapd_new(this.config.mergeconfig, this.dataList);
    // }
  }

  public cancelEditRows(option) {
    this.ROWS_CHECKED.map((item) => {
      this.removeEditRow(item);
      // const trigger = new ButtonOperationResolver(this.componentService, this.config, this.mapOfDataState[item[this.KEY_ID]]);
      // trigger.sendBtnMessage(
      //   option.btnCfg,
      //   { triggerType: BSN_TRIGGER_TYPE.STATE, trigger: BSN_DATAGRID_TRIGGER.CANCEL_EDIT_ROW },
      //   this.config.id,
      // );
    });
    return true;
  }

  public cancelEditRow(option) {
    if (option.data) {
      const itemId = option.data.data[this.KEY_ID];
      if (itemId) {
        this.EDITED_ITEMS = this.EDITED_ITEMS.filter((r) => r[this.KEY_ID] !== itemId);
      }
      // 2020.7.27 计算合并列
      // if (this.config.mergeconfig) {
      //   this._createMapd_new(this.config.mergeconfig, this.dataList);
      // }
    }

    // console.log('-------------', this.ADDED_ITEMS, this.EDITED_ITEMS);
    // 调用方法之前,判断传递的验证配置,解析后是否能够继续进行后续操作
    // return true 表示通过验证, return false 表示未通过,无法继续后续操作

    return true;
  }

  public changeAddedRowsToText(option) {
    // console.log('changeAddedRowsToText', option);
    // 通过服务器端的临时ID与执行数据的ID匹配取得数据
    if (option && Array.isArray(option)) {
      option.map((opt) => {
        if (this.mapOfDataState[opt[this.KEY_ID]]) {
          this.ADDED_ITEMS = this.ADDED_ITEMS.filter((r) => r[this.KEY_ID] !== opt[this.KEY_ID]);
          this.mapOfDataState[opt[this.KEY_ID]].originData = { ...this.mapOfDataState[opt[this.KEY_ID]].data };
          this.config.rowActions &&
            (this.mapOfDataState[opt[this.KEY_ID]].actions = [...this.config.rowActions.filter((action) => action.state === 'text')]);
          // const trigger = new ButtonOperationResolver(this.componentService, this.config, this.mapOfDataState[opt[this.KEY_ID]]);
          // trigger.sendBtnMessage(
          //   {},
          //   { triggerType: BSN_TRIGGER_TYPE.STATE, trigger: BSN_DATAGRID_TRIGGER.CANCEL_EDIT_ROW },
          //   this.config.id,
          // );
        }
      });
    } else if (option) {
      // this.mapOfDataState[option[this.KEY_ID]].state = 'text';
      this.ADDED_ITEMS = this.ADDED_ITEMS.filter((r) => r[this.KEY_ID] !== option[this.KEY_ID]);
      this.mapOfDataState[option[this.KEY_ID]].originData = { ...this.mapOfDataState[option[this.KEY_ID]].data };
      this.config.rowActions &&
        (this.mapOfDataState[option[this.KEY_ID]].actions = [...this.config.rowActions.filter((action) => action.state === 'text')]);
      // const trigger = new ButtonOperationResolver(this.componentService, this.config, this.mapOfDataState[option[this.KEY_ID]]);
      // trigger.sendBtnMessage({}, { triggerType: BSN_TRIGGER_TYPE.STATE, trigger: BSN_DATAGRID_TRIGGER.CANCEL_EDIT_ROW }, this.config.id);
    }
  }

  public changeEditedRowsToText(option) {
    // console.log('changeEditedRowsToText', option);
    // 通过服务器端的临时ID与执行数据的ID匹配取得数据
    if (option && Array.isArray(option)) {
      option.map((opt) => {
        if (this.mapOfDataState[opt[this.KEY_ID]]) {
          this.mapOfDataState[opt[this.KEY_ID]].originData = { ...this.mapOfDataState[opt[this.KEY_ID]].data };
          // const trigger = new ButtonOperationResolver(this.componentService, this.config, this.mapOfDataState[opt[this.KEY_ID]]);
          // trigger.sendBtnMessage(
          //   {},
          //   { triggerType: BSN_TRIGGER_TYPE.STATE, trigger: BSN_DATAGRID_TRIGGER.CANCEL_EDIT_ROW },
          //   this.config.id,
          // );
        }
      });
    } else if (option) {
      // this.mapOfDataState[option[this.KEY_ID]].state = 'text';
      this.mapOfDataState[option[this.KEY_ID]].originData = { ...this.mapOfDataState[option[this.KEY_ID]].data };
      // const trigger = new ButtonOperationResolver(this.componentService, this.config, this.mapOfDataState[option[this.KEY_ID]]);
      // trigger.sendBtnMessage({}, { triggerType: BSN_TRIGGER_TYPE.STATE, trigger: BSN_DATAGRID_TRIGGER.CANCEL_EDIT_ROW }, this.config.id);
    }
  }

  public async deleteCheckedRows(option, params) {
    let response: any;
    if (params !== null) {
      response = await this.executeHttp(option.ajaxConfig, params, null);
    } else {
      response = await this.executeHttp(option.ajaxConfig, null, null);
    }

    if (option['result'] && option['result'].length > 0) {
      option['result'].forEach((result) => {
        new SmtCommandResolver(this).afterOperate(result, this.componentService.modalService);
      });
    }

    if (this.dataList.length > 0) {
      this.setSelectRow(this.dataList[0]);
    }
    this.total = this.dataList.length;
  }

  public createCommandUrl(methodName) {
    let commandName: any;
    let ajaxConfig: any;
    let result: any;
    let commandConfig: any;
    const commandList = Object.keys(this.COMPONENT_METHODS);
    for (let i = 0; i < commandList.length; i++) {
      if (this.COMPONENT_METHODS[commandList[i]] === methodName) {
        commandName = commandList[i];
      }
    }
    if (commandName) {
      this.bindObj.customCommand.forEach((command) => {
        if (command.command === commandName) {
          command.commandContent.forEach((content) => {
            if (content.type === 'ajaxConfig') {
              ajaxConfig = content.ajaxConfig;
              result = content.result;
            } else if (content.type === 'commandConfig') {
              commandConfig = content.commandConfig;
              result = content.result;
            }
          });
        }
      });
    }

    return {
      result: result,
      ajaxConfig: ajaxConfig,
      commandConfig: commandConfig,
    };
  }

  public async deleteRow(option: { ID: string }) {
    let response: any;
    const resObj = this.createCommandUrl('deleteRow');

    if (option.ID && option.ID !== null) {
      response = await this.executeHttp(resObj.ajaxConfig, option.ID, null);
    }

    return {
      state: 1,
      resultData: { ...response }
    }

    // if (resObj.result && resObj.result.length > 0) {
    //   resObj.result.forEach((result) => {
    //     new SmtCommandResolver(this).afterOperate(result, this.componentService.modalService);
    //   });
    // }

    // this.dataList = this.dataList.filter((d) => d[this.KEY_ID] !== response['data'][this.KEY_ID]);
  }

  public async executeCurrentRow(option, params) {
    let response: any;
    if (params !== null) {
      response = await this.executeHttp(option.ajaxConfig, params, null);
    } else {
      response = await this.executeHttp(option.ajaxConfig, null, null);
    }

    if (option['result'] && option['result'].length > 0) {
      option['result'].forEach((result) => {
        new SmtCommandResolver(this).afterOperate(result, this.componentService.modalService);
      });
    }
  }

  private _sendDataSuccessMessage(response, resultCfg): boolean {
    let result = false;
    if (Array.isArray(response.data) && response.data.length <= 0) {
      return result;
    }
    if (response && response.data) {
      const successCfg = resultCfg.find((res) => res.name === 'data');
      // 弹出提示框
      if (successCfg) {
        // new RelationResolver(this).resolveInnerSender(successCfg, response.data, Array.isArray(response.data));
      }
      result = true;
    }

    return result;
  }

  private _sendDataValidationMessage(response, resultCfg) {
    let result = true;
    if (response && Array.isArray(response.validation) && response.validation.length <= 0) {
      return result;
    }
    if (response && response.validation) {
      const validationCfg = resultCfg.find((res) => res.name === 'validation');
      if (validationCfg) {
        // new RelationResolver(this).resolverDataValidationSender(validationCfg, response.validation);
      }
      result = false;
    }
    return result;
  }

  private _sendDataErrorMessage(response, resultCfg) {
    let result = true;
    if (response && Array.isArray(response.error) && response.error.length <= 0) {
      return result;
    }
    if (response && response.error) {
      const errorCfg = resultCfg.find((res) => res.name === 'error');
      if (errorCfg) {
        // new RelationResolver(this).resolverDataErrorSender(errorCfg, response.error);
      }
      result = false;
    }
    return result;
  }

  public async saveRow(option) {
    const ajaxConfig = option.ajaxConfig;

    const response = this.executeHttp(ajaxConfig, option['data']['data'], null);
    // const response = await this.componentService.apiService[ajaxConfig.ajaxType](url, paramData).toPromise();

    // 批量对象数据,返回结果都将以对象的形式返回,如果对应结果没有值则返回 {}
    this._sendDataSuccessMessage(response, ajaxConfig.result);

    // 处理validation结果
    const validationResult = this._sendDataValidationMessage(response, ajaxConfig.result);

    // 处理error结果
    const errorResult = this._sendDataErrorMessage(response, ajaxConfig.result);

    // 返回true可以发送后续操作, 返回false终止发送,之前定义的后续操作将无法执行
    return validationResult && errorResult;
  }

  public async saveRows(option) {
    const ajaxConfig = option.ajaxConfig;
    const response = this.executeHttp(ajaxConfig, option['data']['data'], null);
    //const response = await this.componentService.apiService[ajaxConfig.ajaxType](url, paramsData).toPromise();
    // 批量提交数据,返回结果都将以数组的形式返回,如果对应结果没有值则返回 {}
    this._sendDataSuccessMessage(response, ajaxConfig.result);

    // 处理validation结果
    const validationResult = this._sendDataValidationMessage(response, ajaxConfig.result);

    // 处理error结果
    const errorResult = this._sendDataErrorMessage(response, ajaxConfig.result);

    // 返回true可以发送后续操作, 返回false终止发送,之前定义的后续操作将无法执行
    return validationResult && errorResult;
  }

  public clearSelectRow(type?) {
    this.dataList.map((row) => {
      switch (type) {
        case 'selected':
          this.mapOfDataState[row[this.KEY_ID]].selected = false;
          break;
        case 'checked':
          this.mapOfDataState[row[this.KEY_ID]].checked = false;
          break;
        case 'selectedOrchecked':
          this.mapOfDataState[row[this.KEY_ID]].selected = false;
          this.mapOfDataState[row[this.KEY_ID]].checked = false;
          break;
        default:
          this.mapOfDataState[row[this.KEY_ID]].selected = false;
          this.mapOfDataState[row[this.KEY_ID]].checked = false;
          break;
      }
    });
    this.dataCheckedStatusChange();
  }

  public showInvalidateAddedRows(option) {
    if (option && Array.isArray(option)) {
      option.map((opt) => {
        const rowData = opt.data;
        this.mapOfDataState[rowData[this.KEY_ID]].validation = false;
      });
    } else if (option) {
      const rowData = option.data;
      this.mapOfDataState[rowData[this.KEY_ID]].validation = false;
    }
  }

  public showInvalidateEditedRows(option) {
    console.log(option);
    if (option && Array.isArray(option)) {
      option.map((opt) => {
        const rowData = opt.data;
        this.mapOfDataState[rowData[this.KEY_ID]].validation = false;
      });
    } else if (option) {
      const rowData = option.data;
      this.mapOfDataState[rowData[this.KEY_ID]].validation = false;
    }
  }

  public getCurrentComponentId() {
    return this.bindObj.id;
  }

  public async executeSelectRow(option) {
    const response = this.executeHttp(option.ajaxConfig, option['data']['data'], null);
    this._sendDataSuccessMessage(response, option.ajaxConfig.result);

    // 处理validation结果
    const validationResult = this._sendDataValidationMessage(response, option.ajaxConfig.result);

    // 处理error结果
    const errorResult = this._sendDataErrorMessage(response, option.ajaxConfig.result);

    return validationResult && errorResult;
  }

  public async executeCheckedRows(option) {
    const response = this.executeHttp(option.ajaxConfig, option['data']['data'], null);
    this._sendDataSuccessMessage(response, option.ajaxConfig.result);

    // 处理validation结果
    const validationResult = this._sendDataValidationMessage(response, option.ajaxConfig.result);

    // 处理error结果
    const errorResult = this._sendDataErrorMessage(response, option.ajaxConfig.result);

    return validationResult && errorResult;
  }

  public async executeCheckedRowsIds(option) {
    const response = this.executeHttp(option.ajaxConfig, option['data']['data'], null);
    this._sendDataSuccessMessage(response, option.ajaxConfig.result);

    // 处理validation结果
    const validationResult = this._sendDataValidationMessage(response, option.ajaxConfig.result);

    // 处理error结果
    const errorResult = this._sendDataErrorMessage(response, option.ajaxConfig.result);

    return validationResult && errorResult;
  }

  /**
   * ACTION
   * 显示确认对话框
   * @param option 确认参数
   */
  public showConfirm(option: any) {
    this.buildConfirm(option.dialog, () => {
      // this.executeCurrentRow(option);
    });
  }

  /**
   * ACTION
   * @param option
   */
  public showCheckedItemsIdsConfirm(option: any) {
    this.buildConfirm(option.dialog, () => {
      this.executeCheckedRowsIds(option);
    });
  }

  /**
   * ACTION
   * @param option
   */
  public showCheckedItems(option: any) {
    this.buildConfirm(option.dialog, () => {
      this.executeCheckedRows(option);
    });
  }

  public transferValue(option?) {
    // console.log('将接受传递的值', this.tempValue);
  }
  public downFile(option?) {
    if (!option || !option.ajaxConfig) {
      return true;
    }

    const url = option.ajaxConfig.url;
    let params;
    const ajaxParams = option.ajaxConfig.params ? option.ajaxConfig.params : [];
    params = this.buildParameters(ajaxParams, option.data.originData ? option.data.originData : option.data);

    let url_content = '';

    for (const _params in params) {
      url_content = url_content + _params + '=' + params[_params] + '&&';
    }
    if (url_content.length > 0) {
      url_content = url_content.substr(0, url_content.length - 2);
    }
    let downUrl;
    if (url.indexOf('http') != -1) {
      downUrl = `${url}?${url_content}`;
    } else {
      downUrl = `${this._url}${url}?${url_content}`;
    }

    window.open(`${downUrl}`);
  }

  private download_xlsx_page(columns?) {
    const col = columns.filter(function (item) {
      // 使用filter方法
      if (!item.checked) {
      } else {
        return item;
      }
    });
    const data = [col.map((i) => i.title)];
    this.dataList.forEach((i) =>
      data.push(
        col.map((c) => {
          if (!c.checked) {
          } else return i[c.field as string];
        }),
      ),
    );
    // this.users.forEach((i) => data.push(this.columns.map((c) => i[c.index as string])));
    this.xlsx.export({
      sheets: [
        {
          data,
          name: 'sheet name',
        },
      ],
    });
  }

  // 导出当前条件下的数据
  private async download_xlsx_all(columns?) {
    if (!this.config.loadingConfig) {
      return;
    }
    const col = columns.filter(function (item) {
      // 使用filter方法
      if (!item.checked) {
      } else {
        return item;
      }
    });
    const data = [col.map((i) => i.title)];
    const response: any = this.executeHttp(this.dataSourceCfg.loadingConfig, null, null);
    if (response.success && response.data.length > 0) {
      response.data.forEach((i) => {
        // console.log(i)
        data.push(
          col.map((c) => {
            if (!c.checked) {
            } else return i[c.field as string];
          }),
        );
      });
      //    let i = 0;
      // for (const d of response.data) {
      //   i++;
      //   data.push(col.map(c => {
      //     if (c.hidden) { } else {
      //       if (c.field === '_serilize') {
      //         return i.toString();
      //       } else {
      //         return d[c.field as string];
      //       }

      //     }
      //   }))
      // }
    }
    this.xlsx.export({
      sheets: [
        {
          data,
          name: 'sheet name',
        },
      ],
    });
  }

  public down_xlsx(option?) {
    const dialogCfg = {
      title: '导出设置',
      width: null,
      style: null,
      maskClosable: false,
      cancelText: '取消',
      okText: '确定',
      config: {
        span: '8',
      },
    };

    let dialog;

    const dialogOptional = {
      nzTitle: dialogCfg.title ? dialogCfg.title : '',
      nzWidth: dialogCfg.width ? dialogCfg.width : '600px',
      nzStyle: dialogCfg.style ? dialogCfg.style : null, // style{top:'1px'},
      nzMaskClosable: dialogCfg.hasOwnProperty('maskClosable') ? dialogCfg.maskClosable : false,
      // nzContent: components['DownXlsx'],
      nzComponentParams: {
        config: dialogCfg.config,
        valueConfig: this.config.columns,
      },
      nzFooter: [
        {
          label: dialogCfg.cancelText ? dialogCfg.cancelText : 'cancel',
          onClick: (componentInstance) => {
            dialog.close();
          },
        },
        {
          label: dialogCfg.okText ? dialogCfg.okText : 'OK',
          onClick: (componentInstance) => {
            // componentInstance.
            // 执行导出方法
            if (componentInstance.radioValue === 'page') {
              this.download_xlsx_page(componentInstance.checkOptionsOne);
            }
            if (componentInstance.radioValue === 'all') {
              this.download_xlsx_all(componentInstance.checkOptionsOne);
            }
          },
        },
      ],
    };
    dialog = this.componentService.modalService.create(dialogOptional);
  }

  public valueChange(v?) { }
}
