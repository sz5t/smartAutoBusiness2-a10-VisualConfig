import { Component, Inject, Input, OnInit } from '@angular/core';
import { ComponentServiceProvider } from 'src/app/core/services/components/component.service';
import { BSN_COMPONENT_SERVICES } from 'src/app/core/relations/bsn-relatives';
import { SmtComponentBase } from '../smt-component.base';
import { SmtDataTableAdapter } from './smt-table-adapter';
import { CommonUtils } from 'src/app/core/utils/common-utils';
import { environment } from '@env/environment';
import { XlsxService } from '@delon/abc/xlsx';
import { SmtParameterResolver } from '../../resolver/smt-parameter/smt-parameter-resolver';
import { SmtCommandResolver } from '../../resolver/smt-command/smt-command.resovel';
import { Content } from '@angular/compiler/src/render3/r3_ast';
import { SmtMessageReceiverResolver, SmtMessageSenderEnterResolver, SmtMessageSenderResolver } from '../../resolver/smt-relation/smt-relation-resolver';
import { Subject, Subscription } from 'rxjs';
import { SmtEventResolver } from '../../resolver/smt-event/smt-event-resolver';

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
export class SmtDataTableComponent extends SmtComponentBase implements OnInit {

  constructor(
    @Inject(BSN_COMPONENT_SERVICES)
    // public xlsx: XlsxService,
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
    this.CACHE_VALUE = this.componentService.cacheService;
  }
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
  public execConfig = {
    loading: {
      loadingOninit: true,
      id: 'loading',
      urlType: 'inner', // 请求地址，inner 匹配的后台地址
      urlContent: { // 适配外部请求
        name: "system_url",
        title: "权限系统访问地址"
      },
      url: 'resource/SQL_PERCENT/query/{pathParam1}',
      headParams: [ // 头部参数

      ],
      ajaxType: 'post',
      pathParams: [  // 路径参数
        {
          name: 'pathParam',
          type: 'value',
          value: 'ddd'
        }
      ],
      queryParams: [], // 查询参数
      bodyParams: [], // 请求体参数
    }
  }
  public _sortName;
  public _sortValue;
  public xlsx;
  public _url = environment.SERVER_URL;
  public dataTableConfig: any = {};
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

  public obj = {
    age: 18,
    name: "zhangsan",
    valueName: 'aaa',
    valueName2: 'bbb'
  }

  public ROW_SELECTED: any;
  public ROWS_CHECKED: any[] = [];

  public commandList: any[];

  private _sender_source$: Subject<any>;
  private _receiver_source$: Subject<any>;
  private _trigger_source$: Subject<any>;

  private _receiver_subscription$: Subscription;
  private _sender_subscription$: Subscription;
  private _trigger_receiver_subscription$: Subscription;

  public async ngOnInit() {
    // console.log(this.config);
    // console.log(this.initData);
    // console.log(this.tempData);
    // console.log(this.dataServe);

    this.dataSourceCfg = {
      loadingOnInit: true,
      loadingConfig: {
        id: 'loading',
        urlType: 'inner', // 请求地址，inner 匹配的后台地址
        urlContent: { // 适配外部请求
          name: "system_url",
          title: "权限系统访问地址"
        },
        url: 'smt-app/resource/TEST_TABLE/query',
        headParams: [ // 头部参数

        ],
        ajaxType: 'get',
        pathParams: [  // 路径参数
          // {
          //   name: 'pathParam',
          //   type: 'value',
          //   value: 'ddd'
          // }
        ],
        queryParams: [
          // {
          //   name: 'PROJECT_CODE',
          //   type: 'value',
          //   value: 'SMT_VC'
          // }
        ], // 查询参数
        bodyParams: [], // 请求体参数
      },
      async: false
    }

    // 解析对应的组件配置
    this.createTableConfig(this.config);

    console.log(this.dataTableConfig);

    // 初始化组件值
    this.initComponentValue();

    // 初始化配置属性
    this.initProperty();
    // console.log(this.dataTableConfig, this.tableColumns);

    // 是否需要进行初始化数据加载
    // if (this.dataTableConfig['mainSource']['loadingOnInit']) {


    await this.load(this.dataSourceCfg);
    // }
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
    this._sender_source$ = new SmtMessageSenderEnterResolver(this).resolve(this.dataTableConfig.eventConent);
    this._sender_subscription$ = this._sender_source$.subscribe();
  }
  public createCommandList() {
    const model = this.createCommandModel();
    this.commandList = new SmtCommandResolver(this, model).resolver(this.dataTableConfig['customCommand']);
    // console.log('commandList', this.commandList);
    new SmtMessageReceiverResolver(this).resolve(this.commandList);
  }

  public operateReceiveCommand(commandName, params?) {
    let paramsNameArray: any;
    let paramsobj = {};
    const methodName = this.commandList[this.commandList.findIndex(e => e['commandName'] === commandName)];
    // const paramsNameArray = Object.keys(methodName['declareParams']).map(val => ({
    //   key: val
    // }));
    if (methodName['declareParams'] && methodName['declareParams'].length > 0) {
      paramsNameArray = Object.keys(methodName['declareParams']);
      paramsNameArray.forEach(e => {
        paramsobj[e] = params[e]
      })
      this.analysisCommand(methodName['commandName'], methodName['commandContent'], paramsobj);
    } else {
      this.analysisCommand(methodName['commandName'], methodName['commandContent'], null);
    }

    // this[methodName['commandName']](paramsobj);
  }

  public analysisCommand(methodName, content, params) {
    for (let i = 0; i < content.length; i++) {
      switch (content[i]['type']) {
        case 'ajaxConfig':
          this[methodName](content[i], params);
          break;
        case 'commandConfig':
          for (let j = 0; j < content[i].commandConfig.length; j++) {
            new SmtMessageSenderResolver(this).resolve(content[i]['commandConfig'][j])
          }
      }
    }
  }

  public createCommandModel() {
    return {
      initValue: this.INIT_VALUE,
      cacheValue: this.CACHE_VALUE,
      tempValue: this.TEMP_VALUE,
      item: this.SELECTED_ITEM,
      pageCode: this.CACHE_VALUE.getNone('activeMenu')['mainPageId']
    }

  }

  public buildParam() {
    return {
      tempValue: this.TEMP_VALUE,
      componentValue: this.SELECTED_ITEM,
      initValue: this.INIT_VALUE,
      cacheValue: this.CACHE_VALUE,
      selectedItem: this.SELECTED_ITEM,
      currentItem: this.SELECTED_ITEM,
    }
  }

  public createTableConfig(cfg) {
    const newConfig = new SmtDataTableAdapter;
    this.dataTableConfig = newConfig.transformConfigToDataTbale(cfg);
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
    this.KEY_ID = this.dataTableConfig.keyId;
    this.pageSize = typeof (this.dataTableConfig.pageSize) === 'string' ? parseInt(this.dataTableConfig.pageSize) : this.dataTableConfig.pageSize;
    this.pageSizeOptions = this.dataTableConfig.pageSizeOptions;
    this.showTotal = this.dataTableConfig.showTotal;
    this._buildColumns(this.dataTableConfig.columns, this.dataTableConfig);
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
        actions: this.dataTableConfig.children,
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
    const checkedIdsObj = { IDS: '' }
    if (array.length > 0) {
      for (let i = 0; i < array.length; i++) {
        if (i === 0) {
          ids = array[i][this.KEY_ID]
        } else {
          ids = ids + ',' + array[i][this.KEY_ID]
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
    this.load(this.dataSourceCfg);
  }

  public async load(cfg) {
    if (!cfg.loadingConfig) {
      return;
    }
    let response: any;
    if (!this.dataTableConfig['isPagination']) {
      response = await this.executeHttp(cfg['loadingConfig'], null, null);
    } else {
      response = await this.executeHttp(cfg['loadingConfig'], null, 'paging');
    }

    this.dataList = response.data.resultDatas;
    this.total = response.data.count;

    this.mapOfDataState = {};

    this.createTableMapping();
    this.initSelectedRow();
  }

  public _buildPaging() {
    const params: any = {};
    if (this.dataTableConfig.isPagination) {
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
    if (this.execConfig.loading) {
      this.executeHttp(this.execConfig.loading, 'buildParameters', 'paging').then(
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
    this.dataTableConfig.columns.map((col) => {
      newData[col.field] = null;
    });
    return newData;
  }

  private removeEditRow(item) {
    this.EDITED_ITEMS = this.EDITED_ITEMS.filter((r) => r[this.KEY_ID] !== item[this.KEY_ID]);
    this.dataCheckedStatusChange();
  }

  private addEditRows(item) {
    const index = this.EDITED_ITEMS.findIndex((r) => r[this.KEY_ID] === item[this.KEY_ID]);
    if (index < 0) {
      this.EDITED_ITEMS = [item, ...this.EDITED_ITEMS];
    }
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

  public editRow(option) {
    // console.log('edit====', option);
    if (option.data) {
      this.addEditRows(option.data.data);
      // 2020.7.27 计算合并列
      // if (this.config.mergeconfig) {
      //   this._createMapd_new(this.config.mergeconfig, this.dataList);
      // }
    }
    return true;
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
      option['result'].forEach(result => {
        new SmtCommandResolver(this, this.createCommandModel()).afterOperate(result, this.createCommandModel(), this.componentService.modalService)
      });
    }

    if (this.dataList.length > 0) {
      this.setSelectRow(this.dataList[0]);
    }
    this.total = this.dataList.length;
  }

  public async deleteRow(option, params) {
    let response: any;
    if (params !== null) {
      response = await this.executeHttp(option.ajaxConfig, params, null);
    } else {
      response = await this.executeHttp(option.ajaxConfig, null, null);
    }

    if (option['result'] && option['result'].length > 0) {
      option['result'].forEach(result => {
        new SmtCommandResolver(this, this.createCommandModel()).afterOperate(result, this.createCommandModel(), this.componentService.modalService)
      });
    }

    this.load(this.dataSourceCfg);

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
      option['result'].forEach(result => {
        new SmtCommandResolver(this, this.createCommandModel()).afterOperate(result, this.createCommandModel(), this.componentService.modalService)
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
    return this.dataTableConfig.id;
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
    const response: any = this.executeHttp(this.execConfig.loading, null, null);
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

  public testAction() {
    console.log(this.SELECTED_ITEM);
    console.log(this.CHECKED_ITEMS_IDS);
  }

  // private resolveRelations() {
  //   if (this.dataTableConfig.eventConent && this.config.cascade.messageSender) {
  //     if (!this._sender_source$) {
  //       // 解析组件发送消息配置,并注册消息发送对象
  //       this._sender_source$ = new SmtMessageSenderEnterResolver(this).resolve(this.config);
  //       this._sender_subscription$ = this._sender_source$.subscribe();
  //     }
  //   }
  //   if (this.config.cascade && this.config.cascade.messageReceiver) {
  //     // 解析消息接受配置,并注册消息接收对象
  //     // this._receiver_source$ = new RelationResolver(this).resolveReceiver(this.config);
  //     // this._receiver_subscription$ = this._receiver_source$.subscribe();
  //     new RelationResolver(this).resolveReceiver(this.config);
  //   }

  //   this._trigger_source$ = new RelationResolver(this).resolve();
  // }
}