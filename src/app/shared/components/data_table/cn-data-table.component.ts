import { CfgLayoutPageComponent } from './../../config-components/config-layout-page/cfg-layout-page/cfg-layout-page.component';
import { Type, Component, OnInit, AfterViewInit, OnDestroy, Inject, Input, Output, EventEmitter } from '@angular/core';
import { CnDataFormComponent } from '../data-form/cn-data-form.component';
import { CnComponentBase } from '../cn-component.base';
import { BSN_COMPONENT_SERVICES } from 'src/app/core/relations/bsn-relatives';
import { ComponentServiceProvider } from 'src/app/core/services/components/component.service';

import { CN_DATA_GRID_METHOD } from 'src/app/core/relations/bsn-methods';
import { CN_DATA_GRID_PROPERTY } from 'src/app/core/relations/bsn-property/data-grid.property.interface';
import { Subject, Subscription } from 'rxjs';
import { environment } from '@env/environment';
import { RelationResolver } from '../../resolver/relation/relation.resolver';
import { ParameterResolver } from '../../resolver/parameter/parameter.resolver';
import { CommonUtils } from 'src/app/core/utils/common-utils';
import { ButtonOperationResolver } from '../../resolver/buttonOperation/buttonOperation.resolver';
import { BSN_TRIGGER_TYPE } from 'src/app/core/relations/bsn-status';
import { BSN_DATAGRID_TRIGGER } from 'src/app/core/relations/bsn-trigger/data-grid.trigger.interface';
import { CnPageComponent } from '../cn-page/cn-page.component';
import { PageStructure } from '../../resolver/structure/page_structure';
import { XlsxService } from '@delon/abc/xlsx';
import { CnGridDownXlsxComponent } from './cn-grid-items/cn-grid-down-xlsx/cn-grid-down-xlsx.component';
import { HttpHeaders } from '@angular/common/http';

// const component: { [type: string]: Type<any> } = {
//     layout: LayoutResolverComponent,
//     form: CnFormWindowResolverComponent,
//     upload: BsnUploadComponent,
//     importExcel: BsnImportExcelComponent
// };
const components: { [type: string]: Type<any> } = {
  form: CnDataFormComponent,
  cfgLayoutPage: CfgLayoutPageComponent,
  DownXlsx: CnGridDownXlsxComponent,
  // label: ,
  // selectMultiple:,
  // datePicker:,
  // yearPicker:,
  // weekPicke:,
  // rangePicker:,
  // monthPicker:,
  // switch:,
  // radio:,
  // checkbox:,
  // treeSelect:,
  // transfer: ,
  // gridSelect:,
  // textarea: ,
  // customSelect: ,
};

export declare type _HttpHeaders =
  | HttpHeaders
  | {
      [header: string]: string | string[];
    };

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'cn-data-table,[cn-data-table]',
  templateUrl: './cn-data-table.component.html',
  styleUrls: [`./cn-data-table.component.less`],
})
export class CnDataTableComponent extends CnComponentBase implements OnInit, AfterViewInit, OnDestroy {
  constructor(
    @Inject(BSN_COMPONENT_SERVICES)
    public componentService: ComponentServiceProvider,
    private xlsx: XlsxService,
  ) {
    super(componentService);
    this.cacheValue = this.componentService.cacheService;

    // init cacheValue
  }

  @Input()
  public config; // dataTables ???????????????
  @Input() initData;
  @Input() tempData;
  @Input() changeValue: any;
  @Input()
  public permissions = [];
  @Input()
  public dataList = [];
  @Input() dataServe;
  @Output() public updateValue = new EventEmitter();
  /**
   * ????????????
   * ???????????????????????????
   */
  public COMPONENT_NAME = 'CnDataTable';
  /**
   * ????????????????????????
   * ???????????????????????????
   */
  public COMPONENT_METHODS = CN_DATA_GRID_METHOD;

  public COMPONENT_PROPERTY = CN_DATA_GRID_PROPERTY;

  public tableColumns = [];

  public spanCount = 0;
  public isLoading = false;
  public loading = false;
  public pageIndex = 1;
  public pageSize = 10;
  public total = 0;
  public focusIds;

  public isAllChecked = false;
  public indeterminate = false;
  // public mapOfCheckedId: { [key: string]: boolean } = {};
  // public mapOfSelectedId: { [key: string]: boolean } = {};
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

  public KEY_ID: string;

  public _sortName;
  public _sortValue;

  public ROWS_ADDED: any[] = [];
  public ROWS_EDITED: any[] = [];
  public ROW_SELECTED: any;
  public ROWS_CHECKED: any[] = [];
  public COMPONENT_VALUE: any[] = [];
  public ROW_CURRENT: any;
  public operationRow: any;

  // ????????????????????????
  public selectedRowValue;

  private _selectedRow;
  private _rowsData;
  private _addedRowsData;
  private _editedRowsData;
  private _search_row;

  private _columnFilterList;

  private _sender_source$: Subject<any>;
  private _receiver_source$: Subject<any>;
  private _trigger_source$: Subject<any>;

  private _receiver_subscription$: Subscription;
  private _sender_subscription$: Subscription;
  private _trigger_receiver_subscription$: Subscription;

  // ??????????????????
  public beforeOperation;
  private _ajaxConfigObj: any = {};

  public _url = environment.SERVER_URL;
  public RowActions: any;

  public ajaxColumns; // ?????????

  windowDialog;

  formCascade = {};

  public is_hidden = false;

  // =========================????????????????????????============================
  public nodes = [];

  public showTree = false;

  public async ngOnInit() {
    this.initLog();
    this._initInnerValue();
    this.setChangeValue(this.changeValue);
    // ????????????????????????
    this.KEY_ID = this.config.keyId ? this.config.keyId : 'id';

    // ???????????????????????????
    this.config.pageSize && (this.pageSize = this.config.pageSize);
    this.config.ajaxConfig.forEach((ajax) => {
      this._ajaxConfigObj[ajax.id] = ajax;
    });
    // ???????????????????????????

    if (this.config.columnsAjax) {
      await this.loadDynamicColumns();
      console.log('??????++++???', this.config.columns);
    }
    await this.getPermissionRowActions();
    this._buildColumns(this.config.columns);

    // ??????????????????
    this.resolveRelations();

    // ???????????????????????????????????????
    if (this.config.loadingOnInit) {
      await this.load();
    }
  }

  private _initInnerValue() {
    if (this.tempData) {
      this.tempValue = this.tempData;
    } else {
      this.tempValue = {};
    }
    if (this.initData) {
      this.initValue = this.initData;
    } else {
      this.initValue = {};
    }
  }

  public setInitValue(val) {
    this.initValue = { ...this.initValue, ...val };
  }

  public ngAfterViewInit() {}

  public ngOnDestroy() {
    // ??????????????????
    this.unsubscribeRelation();
    // ????????????????????????
    if (this._receiver_subscription$) {
      this._receiver_subscription$.unsubscribe();
    }

    if (this._sender_subscription$) {
      this._sender_subscription$.unsubscribe();
    }

    // ?????????????????????
    if (this._trigger_receiver_subscription$) {
      this._trigger_receiver_subscription$.unsubscribe();
    }

    if (this._trigger_source$) {
      this._trigger_source$.unsubscribe();
    }

    if (this.subscription$) {
      this.subscription$.unsubscribe();
    }
  }

  /**
   * ??????????????????
   */
  private resolveRelations() {
    if (this.config.cascade && this.config.cascade.messageSender) {
      if (this.config.isApproval) {
        const messageSend: any[] = this.componentService.cacheService.getNone('ApprovalMessageSend')
          ? this.componentService.cacheService.getNone('ApprovalMessageSend')
          : [];
        if (messageSend.length > 0) {
          if (this.config.cascade.messageSender) {
            this.config.cascade.messageSender = [...this.config.cascade.messageSender, ...messageSend];
          } else {
            this.config.cascade.messageSender = messageSend;
          }
        }
      }
      if (!this._sender_source$) {
        // ??????????????????????????????,???????????????????????????
        this._sender_source$ = new RelationResolver(this).resolveSender(this.config);
        this._sender_subscription$ = this._sender_source$.subscribe();
      }
    }
    if (this.config.cascade && this.config.cascade.messageReceiver) {
      // ????????????????????????,???????????????????????????
      // this._receiver_source$ = new RelationResolver(this).resolveReceiver(this.config);
      // this._receiver_subscription$ = this._receiver_source$.subscribe();
      new RelationResolver(this).resolveReceiver(this.config);
    }

    this._trigger_source$ = new RelationResolver(this).resolve();
  }

  /**
   * ?????????????????????
   * @param columns
   */
  private _buildColumns(columns) {
    if (Array.isArray(columns) && columns.length > 0) {
      const colIndex = columns.filter((item) => item.type === 'index');
      const colObjs = columns.filter((item) => item.type === 'field');
      const actionCfgs = columns.filter((item) => item.type === 'action');
      colObjs.forEach((col) => {
        if (col.editor) {
          if (col.editor.loadingConfig) {
            col.editor.loadingConfig.ajaxConfig = this._ajaxConfigObj[col.editor.loadingConfig.id];
          }
          if (col.editor.loadingItemConfig) {
            col.editor.loadingItemConfig.ajaxConfig = this._ajaxConfigObj[col.editor.loadingItemConfig.id];
          }
          if (col.editor.expandConfig) {
            col.editor.expandConfig.ajaxConfig = this._ajaxConfigObj[col.editor.expandConfig.id];
          }
          if (col.editor.hasOwnProperty('changeValueId')) {
            col.editor.changeValue = this.findChangeValueConfig(col.editor.changeValueId);
          }
        }
      });
      if (actionCfgs && actionCfgs.length > 0) {
        actionCfgs.map((cfg) => {
          const colActions = [];
          cfg.actionIds.map((actionId) => {
            const act = this.RowActions.find((action) => actionId === action.id);
            if (act) {
              colActions.push(act);
            }
          });
          if (colActions.length > 0) {
            cfg.action = colActions;
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

  public getPermissionRowActions() {
    let componentPermission: any;
    const colActions = [];
    if (this.config.id) {
      componentPermission = this.getMenuComponentPermissionConfigById(this.config.id);
    }
    let enableToolbarPermission = false;
    if (environment.systemSettings && environment.systemSettings.systemMode === 'work') {
      if (environment.systemSettings && environment.systemSettings.permissionInfo) {
        if (environment.systemSettings.enablePermission) {
          enableToolbarPermission = environment.systemSettings.permissionInfo.enableRowActionPermission;
        }
      }
    }
    if (this.config.exceptionPermission) {
      enableToolbarPermission = false;
    }
    const permissionMap = new Map();
    if (componentPermission && componentPermission.permission) {
      componentPermission &&
        componentPermission.permission.forEach((item) => {
          if (item.type === 'rowActions') {
            permissionMap.set(item.id, item);
          }
        });
    }

    if (this.config.rowActions) {
      this.config.rowActions.forEach((item) => {
        if (
          !enableToolbarPermission ||
          !item.hasOwnProperty('id') ||
          item['exceptionPermission'] ||
          (enableToolbarPermission && item.id && permissionMap.has(item.id + '_rowActions'))
        ) {
          item.permission = true;
        }

        if (item.permission) {
          colActions.push(item);
        }
      });
    }

    this.RowActions = colActions;
    console.log('????????????', this.RowActions, componentPermission);
  }

  private findChangeValueConfig(changeValueId) {
    let changeValueConfig;
    if (this.config.changeValue && Array.isArray(this.config.changeValue) && this.config.changeValue.length > 0) {
      const c = this.config.changeValue.find((cfg) => cfg.id === changeValueId);
      if (c) {
        changeValueConfig = c;
      }
    }
    return changeValueConfig;
  }
  private _initComponentData() {
    this.mapOfDataState = {};
    this.ROWS_ADDED = [];
    this.ROWS_EDITED = [];
    this.ROW_SELECTED = [];
    this.ROWS_CHECKED = [];
    this.COMPONENT_VALUE = [];
    this.ROW_SELECTED = JSON.parse(`{"${this.KEY_ID}": ""}`);
  }

  public loadByFilter() {
    if (!this.config.loadingConfig) {
      return;
    }
    this.isLoading = true;
    const url = this.config.loadingConfig.url;
    const method = this.config.loadingConfig.method ? this.config.loadingConfig.method : this.config.loadingConfig.ajaxType;
    const params = {
      ...this.buildParameters(this.config.loadingConfig.params),
      ...this._buildPaging(),
      ...this._buildFilter(this.config.loadingConfig.filter), // ??????????????????????????????????????????
      ...this._buildSort(),
      // ...this._buildColumnFilter(),
      // ...this._buildFocusId(),
      // ...this._buildSearch()
    };

    // this.componentService.apiService[method](url, method, { params }).subscribe(
    this.componentService.apiService[method](url, params).subscribe(
      (response) => {
        if (response.data.hasOwnProperty('_procedure_resultset_1')) {
          response.data['resultDatas'] = response.data['_procedure_resultset_1'];
        }
        if (response && response.data && response.data.resultDatas) {
          this._initComponentData();
          let _index = 0;
          if (this.pageIndex === 1) {
            _index = _index;
          } else {
            _index = (this.pageIndex - 1) * this.pageSize;
          }
          response.data.resultDatas.map((d, index) => {
            _index = _index + 1;
            d._index = _index;
            const _style = this.computeRowStyle(d);
            this.mapOfDataState[d[this.KEY_ID]] = {
              disabled: false,
              checked: false, // index === 0 ? true : false,
              selected: false, // index === 0 ? true : false,
              state: 'text',
              data: d,
              originData: { ...d },
              validation: true,
              actions: this.getRowActions('text'),
              mergeData: {},
              style: _style ? _style : null,
            };
            if (!this.config.isSelected) {
              index === 0 && (this.ROW_SELECTED = d);
            } else {
              if (d[this.KEY_ID] === this.selectedRowValue) {
                this.ROW_SELECTED = d;
              }
            }
          });

          this.dataList = response.data.resultDatas;
          this.total = response.data.count;
          // ??????
          // this.dataCheckedStatusChange();
          // ???????????????????????????, ??????????????????????????????????????????,?????????setSelectRow???????????????
          // this.dataList.length > 0 && this.setSelectRow(this.ROW_SELECTED);

          this.setSelectRow(this.ROW_SELECTED);
          this.isLoading = false;
        } else {
          this.isLoading = false;
        }
      },
      (error) => {
        console.log(error);
      },
    );
  }

  public async load() {
    this.isLoading = true;
    if (!this.config.loadingConfig) {
      return;
    }
    let response: any;
    if (this.config.loadingConfig['enableAjaxMore']) {
      if (this.config.loadingConfig.hasOwnProperty(['isPaging']) && !this.config.loadingConfig['isPaging']) {
        response = await this.executeHttpMore(this.config.loadingConfig, {}, 'buildParameters', null);
      } else {
        response = await this.executeHttpMore(this.config.loadingConfig, {}, 'buildParameters', 'paging');
      }
    } else {
      const url = this.config.loadingConfig.url;
      const method = this.config.loadingConfig.method ? this.config.loadingConfig.method : this.config.loadingConfig.ajaxType;

      if (this.config.isApproval) {
        const ApprovalAjaxParams: any = this.componentService.cacheService.getNone('ApprovalAjaxParams')
          ? this.componentService.cacheService.getNone('ApprovalAjaxParams')
          : null;
        if (ApprovalAjaxParams) {
          if (this.config.loadingConfig.params) {
            this.config.loadingConfig.params.push(ApprovalAjaxParams);
          } else {
            this.config.loadingConfig['params'] = [];
            this.config.loadingConfig.params.push(ApprovalAjaxParams);
          }
        }
        // this.componentService.cacheService.remove('ApprovalAjaxParams')
      }

      const params = {
        ...this.buildParameters(this.config.loadingConfig.params),
        ...this._buildPaging(),
        ...this._buildFilter(this.config.loadingConfig.filter),
        ...this._buildSort(),
        // ...this._buildColumnFilter(),
        // ...this._buildFocusId(),
        // ...this._buildSearch()
      };

      // const response: any = await this.componentService.apiService[method](url, method, { params }).toPromise();
      response = await this.executeHttpRequest(url, method, params).toPromise();
    }
    if (response && response.data.hasOwnProperty('_procedure_resultset_1')) {
      response.data['resultDatas'] = response.data['_procedure_resultset_1'];
    }
    if (response && response.data && response.data.resultDatas) {
      this._initComponentData();
      let _index = 0;
      if (this.pageIndex === 1) {
        _index = _index;
      } else {
        _index = (this.pageIndex - 1) * this.pageSize;
      }
      response.data.resultDatas.map((d, index) => {
        _index = _index + 1;
        d._index = _index;

        const _style = this.computeRowStyle(d);
        this.mapOfDataState[d[this.KEY_ID]] = {
          disabled: false,
          checked: false, // index === 0 ? true : false,
          selected: false, // index === 0 ? true : false,
          state: 'text',
          data: d,
          originData: { ...d },
          validation: true,
          actions: this.getRowActions('text'),
          mergeData: {},
          style: _style ? _style : null,
        };
        if (!this.config.isSelected) {
          index === 0 && (this.ROW_SELECTED = d);
        } else {
          if (d[this.KEY_ID] === this.selectedRowValue) {
            this.ROW_SELECTED = d;
          }
        }
      });

      this.dataList = response.data.resultDatas;
      this.total = response.data.count;
      // ??????
      // this.dataCheckedStatusChange();
      // ???????????????????????????, ??????????????????????????????????????????,?????????setSelectRow???????????????
      // this.dataList.length > 0 && this.setSelectRow(this.ROW_SELECTED);

      this.setSelectRow(this.ROW_SELECTED);
      this.isLoading = false;
      // 2020.7.27 ???????????????
      if (this.config.mergeconfig) {
        this._createMapd_new(this.config.mergeconfig, this.dataList);
      }
    } else if (response.data && response.data.length > 0) {
      this._initComponentData();
      let _index = 0;
      if (this.pageIndex === 1) {
        _index = _index;
      } else {
        _index = (this.pageIndex - 1) * this.pageSize;
      }
      response.data.map((d, index) => {
        _index = _index + 1;
        d._index = _index;

        const _style = this.computeRowStyle(d);
        this.mapOfDataState[d[this.KEY_ID]] = {
          disabled: false,
          checked: false, // index === 0 ? true : false,
          selected: false, // index === 0 ? true : false,
          state: 'text',
          data: d,
          originData: { ...d },
          validation: true,
          actions: this.getRowActions('text'),
          mergeData: {},
          style: _style ? _style : null,
        };
        if (!this.config.isSelected) {
          index === 0 && (this.ROW_SELECTED = d);
        } else {
          if (d[this.KEY_ID] === this.selectedRowValue) {
            this.ROW_SELECTED = d;
          }
        }
      });
      this.dataList = response.data;
      this.total = response.data.length;
      this.isLoading = false;
      if (this.config.mergeconfig) {
        this._createMapd_new(this.config.mergeconfig, this.dataList);
      }
    } else {
      this.isLoading = false;
      this._initComponentData();
      this.dataList = [];
      this.total = 0;
    }

    this.dataServe && this.dataServe.setComponentValue(this.config.id, this.dataList);

    // this.componentService.apiService.getRequest(url, method, { params }).subscribe(response => {
    //     if (response && response.data && response.data.resultDatas) {
    //         this._initComponentData();
    //         let _index = 0;
    //         if (this.pageIndex === 1) {
    //             _index = _index;
    //         } else {
    //             _index = (this.pageIndex - 1) * this.pageSize;
    //         }
    //         response.data.resultDatas.map((d, index) => {

    //             _index = _index + 1;
    //             d['_index'] = _index;
    //             this.mapOfDataState[d[this.KEY_ID]] = {
    //                 disabled: false,
    //                 checked: false, // index === 0 ? true : false,
    //                 selected: false, // index === 0 ? true : false,
    //                 state: 'text',
    //                 data: d,
    //                 originData: { ...d },
    //                 validation: true,
    //                 actions: this.getRowActions('text'),
    //                 mergeData: {}
    //             };
    //             if (!this.config.isSelected) {
    //                 index === 0 && (this.ROW_SELECTED = d);
    //             } else {
    //                 if (d[this.KEY_ID] === this.selectedRowValue) {
    //                     this.ROW_SELECTED = d
    //                 }
    //             }

    //         });

    //         this.dataList = response.data.resultDatas;
    //         this.total = response.data.count;
    //         // ??????
    //         // this.dataCheckedStatusChange();
    //         // ???????????????????????????, ??????????????????????????????????????????,?????????setSelectRow???????????????
    //         // this.dataList.length > 0 && this.setSelectRow(this.ROW_SELECTED);

    //         this.setSelectRow(this.ROW_SELECTED);
    //         this.isLoading = false;
    //         // 2020.7.27 ???????????????
    //         if (this.config.mergeconfig)
    //             this._createMapd_new(this.config.mergeconfig, this.dataList);
    //     } else {
    //         this.isLoading = false;
    //         this._initComponentData();
    //         this.dataList = [];
    //         this.total = 0;
    //     }

    //     this.dataServe && this.dataServe.setComponentValue(this.config.id, this.dataList);
    // }, error => {
    //     console.log(error);
    // });
  }

  // ???????????????
  private computeRowStyle(row?): any {
    let C_Style;

    let rowStyle;
    if (this.config.hasOwnProperty('rowStyle')) {
      rowStyle = this.config.rowStyle;
    } else {
      return null;
    }

    const rowStyle1 = [
      {
        type: 'default', //  ??????default ???condition??????????????????
        dataSource: {
          // ?????????
          type: 'rowValue', // rowValue  tempValue  initValue value
          valueName: '',
          value: '',
        },
        // ??????????????????????????????????????????
        condition: {
          type: 'regular', //regular ????????? isnull ???  isnotnull ??????
          regular: '^0$',
        },
        style: {
          // ????????????????????????rowstyle
        },
      },
    ];

    rowStyle.forEach((item) => {
      if (item.type === 'default') {
        C_Style = item['style'] ? item['style'] : null;
      } else {
        if (item.dataSource) {
          const dataSource = item.dataSource;
          let _data: any;
          if (dataSource.type === 'rowValue') {
            _data = row[dataSource['valueName']];
          }
          if (dataSource.type === 'tempValue') {
            _data = this.tempValue[dataSource['valueName']];
          }
          if (dataSource.type === 'initValue') {
            _data = this.initValue[dataSource['valueName']];
          }
          if (dataSource.type === 'value') {
            _data = dataSource['value'];
          }

          if (item.condition) {
            let regularflag = false;
            if (item.condition.type === 'regular') {
              const reg1 = new RegExp(item.condition.regular);
              regularflag = reg1.test(_data);
            }
            if (item.condition.type.toLowerCase() === 'isnull') {
              if (!_data || _data === null || _data === 'null' || _data === 'NULL') {
                regularflag = true;
              }
            }
            if (item.condition.type.toLowerCase() === 'isnotnull') {
              if (_data) {
                regularflag = true;
              }
            }
            if (regularflag) {
              C_Style = item['style'] ? item['style'] : null;
            }
          }
        }
      }
    });
    return C_Style;
  }

  public loadRefreshData(option) {
    this.isLoading = true;
    if (this.config.loadingConfig['enableAjaxMore']) {
      this.executeHttpMore(this.config.loadingConfig, {}, 'buildParameters', 'paging').then(
        (response) => {
          if (response.data.hasOwnProperty('_procedure_resultset_1')) {
            response.data['resultDatas'] = response.data['_procedure_resultset_1'];
          }
          if (response && response.data && response.data) {
            this.refreshData(response.data.resultDatas);
            this.isLoading = false;
          } else {
            this.isLoading = false;
          }
        },
        (error) => {
          console.log(error);
        },
      );
    } else {
      const url = this.config.loadingConfig.url;
      const method = this.config.loadingConfig.method ? this.config.loadingConfig.method : this.config.loadingConfig.ajaxType;
      // ??????????????????id??????,??????ids
      const param1: any = {};
      if (option && Array.isArray(option)) {
        const rids = [];
        option.map((opt) => {
          rids.push(opt[this.KEY_ID]);
        });
        param1[this.KEY_ID] = `in(${rids.join(',')})`;
      } else if (option) {
        param1[this.KEY_ID] = `in(${option[this.KEY_ID]})`;
      }

      // ??????????????????
      const params = {
        ...this.buildParameters(this.config.loadingConfig.params),
        // ...this._buildPaging(),
        ...param1,
      };

      // this.componentService.apiService.getRequest(url, method, { params })
      this.componentService.apiService[method](url, params).subscribe(
        (response) => {
          if (response.data.hasOwnProperty('_procedure_resultset_1')) {
            response.data['resultDatas'] = response.data['_procedure_resultset_1'];
          }
          if (response && response.data && response.data) {
            this.refreshData(response.data);
            this.isLoading = false;
          } else {
            this.isLoading = false;
          }
        },
        (error) => {
          console.log(error);
        },
      );
    }
  }
  public async loadDynamicColumns() {
    const url = this.config.columnsAjax.url;
    const method = this.config.columnsAjax.method ? this.config.columnsAjax.method : this.config.columnsAjax.ajaxType;

    const params = {
      ...this.buildParameters(this.config.columnsAjax.params),
    };
    const loadColumns = [];
    const loadData = await this.componentService.apiService.getRequest(url, method, { params }).toPromise();
    if (loadData && loadData.data && loadData.success) {
      if (loadData.data) {
        // console.log('?????????????????????', loadData.data);
        if (loadData.data.length > 0) {
          if (loadData.data.length < 50) {
            // ?????????????????????50???
            this.ajaxColumns = loadData.data;
            loadData.data.forEach((element) => {
              const column: any = {};
              column.type = 'field';
              this.config.columnsConfig.forEach((cc) => {
                if (cc.feild) {
                  column[cc.name] = element[cc.feild];
                } else {
                  column[cc.name] = cc.value;
                }
              });
              loadColumns.push(column);
            });
          }
        }
      }
    }
    const Columns = this.mergedColumns(loadColumns);
    this.config.columns = Columns;
  }

  public mergedColumns(fieldConfig?) {
    const dynamicColumns = this.setFieldByColumns(fieldConfig);
    const dynamicdefaultcolumns = [];
    this.config.defaultcolumns.forEach((c) => {
      if (c.type !== 'action') {
        const index = dynamicColumns.findIndex((item) => item.feild === c.field);
        if (index > -1) {
          // ?????????????????????????????????
        } else {
          dynamicdefaultcolumns.push(c);
        }
      } else {
        dynamicdefaultcolumns.push(c);
      }
    });

    const columns = [...dynamicdefaultcolumns, ...dynamicColumns];
    // console.log('???????????????', columns);
    return columns;
  }

  public setFieldByColumns(fieldConfig?) {
    const cf_config = [];
    fieldConfig.forEach((f) => {
      const cf: any = {};
      cf.title = f.title;
      cf.type = f.type;
      cf.subtitle = f.subtitle ? f.subtitle : null;
      cf.subtitletext = f.subtitletext ? f.subtitletext : null;
      cf.text = f.text ? f.text : null;
      cf.field = f.field;
      cf.width = f.width;
      cf.hidden = f.hidden;
      cf.titleField = f.titleField;
      cf.fieldAlign = f.fieldAlign ? f.field.Align : 'text-center';
      if (f.isEdit) {
        cf.editor = this.setEditConfig(f);
      }
      cf_config.push(cf);
    });
    return cf_config;
  }

  public setEditConfig(d?) {
    let c;
    if (d.editType === 'input') {
      c = {
        type: 'input',
        field: d.field,
        options: {
          type: 'input',
          width: d.width,
          inputType: 'text',
        },
      };
    } else if (d.editType === 'select') {
      // ??????????????????????????????????????????????????????????????????
      c = {
        type: 'select',
        field: d.field,
        options: {
          type: 'select',
          labelSize: '6',
          controlSize: '18',
          inputType: 'submit',
          disabled: false,
          size: 'default',
          width: d.width,
          defaultValue: '1',
          options: [
            {
              label: '??????',
              value: '1',
              disabled: false,
            },
            {
              label: '?????????',
              value: '2',
              disabled: false,
            },
          ],
        },
      };
    }
    return c;
  }

  /**
   * ????????????????????????
   * @param filterConfig
   * @returns {{}}
   * @private
   */
  private _buildFilter(filterConfig) {
    let filter = {};
    if (filterConfig) {
      filter = ParameterResolver.resolve({
        params: filterConfig,
        tempValue: this.tempValue,
        cacheValue: this.cacheValue,
        initValue: this.initValue,
        userValue: this.userValue,
      });
    }
    return filter;
  }

  // #region ????????????
  /**
   * ??????URL
   * @param ajaxUrl
   * @returns {string}
   * @private
   */
  private _buildURL(ajaxUrl) {
    let url = '';
    if (ajaxUrl && this._isUrlString(ajaxUrl)) {
      url = ajaxUrl;
    } else if (ajaxUrl) {
    }
    return url;
  }
  /**
   * ????????????
   * @returns {{}}
   * @private
   */
  private _buildPaging() {
    const params: any = {};
    if (this.config.isPagination) {
      params._page = this.pageIndex;
      params._rows = this.pageSize;
    }
    return params;
  }
  /**
   * ??????URL??????
   * @param url
   * @returns {boolean}
   * @private
   */
  private _isUrlString(url) {
    return Object.prototype.toString.call(url) === '[object String]';
  }
  /**
   * ????????????
   * @returns {{}}
   * @private
   */
  private _buildSort() {
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
  /**
   * ??????????????????
   * @returns {{}}
   * @private
   */
  private _buildFocusId() {
    const focusParams: any = {};
    // ?????????????????????
    if (this.focusIds) {
      focusParams._focusedId = this.focusIds;
    }
    return focusParams;
  }
  /**
   * ??????????????????
   * @returns {{}}
   * @private
   */
  private _buildColumnFilter() {
    const filterParams = {};
    if (this._columnFilterList && this._columnFilterList.length > 0) {
      this._columnFilterList.map((filter) => {
        const valueStr = [];
        filter.value.map((value) => {
          valueStr.push(`'${value}'`);
        });
        filterParams[filter.field] = `in(${valueStr.join(',')})`;
      });
    }
    return filterParams;
  }
  /**
   * ??????????????????
   */
  public _buildSearch() {
    let search = {};
    if (this._search_row) {
      const searchData = JSON.parse(JSON.stringify(this._search_row));
      delete searchData.key;
      delete searchData.checked;
      delete searchData.row_status;
      delete searchData.selected;

      search = searchData;
    }
    return search;
  }
  // #endregion

  // #region state ????????????
  private createNewRowData() {
    const newData = {};
    this.config.columns.map((col) => {
      newData[col.field] = null;
    });
    return newData;
  }

  public addRow(r?) {
    // ?????????????????????
    const newId = CommonUtils.uuID(36);
    let newData = this.createNewRowData();
    newData[this.KEY_ID] = newId;
    if (r) {
      newData = { ...newData, ...r };
    }

    // ??????????????????????????????,???????????????????????????????????????
    this.dataList = [newData, ...this.dataList];
    this.total = this.total + 1;

    // ??????????????????
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

    this.ROWS_ADDED = [newData, ...this.ROWS_ADDED];

    this.dataCheckedStatusChange();
    // this.setSelectRow(newData);

    // ????????????
  }

  private removeEditRow(item) {
    this.ROWS_EDITED = this.ROWS_EDITED.filter((r) => r[this.KEY_ID] !== item[this.KEY_ID]);
    this.dataCheckedStatusChange();
  }

  private addEditRows(item) {
    const index = this.ROWS_EDITED.findIndex((r) => r[this.KEY_ID] === item[this.KEY_ID]);
    if (index < 0) {
      this.ROWS_EDITED = [item, ...this.ROWS_EDITED];
    }
  }

  public editRows(option) {
    this.ROWS_CHECKED.map((item) => {
      this.addEditRows(item);
      const trigger = new ButtonOperationResolver(this.componentService, this.config, this.mapOfDataState[item[this.KEY_ID]]);
      trigger.sendBtnMessage(
        option.btnCfg,
        { triggerType: BSN_TRIGGER_TYPE.STATE, trigger: BSN_DATAGRID_TRIGGER.EDIT_ROW },
        this.config.id,
      );
    });
  }

  public editRow(option) {
    console.log('edit====', option);
    if (option.data) {
      this.addEditRows(option.data.data);
      // 2020.7.27 ???????????????
      if (this.config.mergeconfig) {
        this._createMapd_new(this.config.mergeconfig, this.dataList);
      }
    }
    return true;
  }

  // ????????????????????? ??????
  public cancelNewRow(option) {
    if (option.data) {
      this.removeNewRow(option.data.data);
    }
    this.dataCheckedStatusChange();
  }

  public cancelNewRows(option) {
    this.ROWS_ADDED.map((item) => {
      this.removeNewRow(item);
      const trigger = new ButtonOperationResolver(this.componentService, this.config, this.mapOfDataState[item[this.KEY_ID]]);
      trigger.sendBtnMessage(
        option.btnCfg,
        { triggerType: BSN_TRIGGER_TYPE.STATE, trigger: BSN_DATAGRID_TRIGGER.CANCEL_EDIT_ROW },
        this.config.id,
      );
    });
    this.dataCheckedStatusChange();
    return true;
  }

  private removeNewRow(item) {
    this.dataList = this.dataList.filter((r) => r[this.KEY_ID] !== item[this.KEY_ID]);
    this.ROWS_ADDED = this.ROWS_ADDED.filter((r) => r[this.KEY_ID] !== item[this.KEY_ID]);
    delete this.mapOfDataState[item[this.KEY_ID]];
    if (this.total > 0) {
      this.total = this.total - 1;
    }
    // 2020.7.27 ???????????????
    if (this.config.mergeconfig) {
      this._createMapd_new(this.config.mergeconfig, this.dataList);
    }
  }

  public cancelEditRows(option) {
    this.ROWS_CHECKED.map((item) => {
      this.removeEditRow(item);
      const trigger = new ButtonOperationResolver(this.componentService, this.config, this.mapOfDataState[item[this.KEY_ID]]);
      trigger.sendBtnMessage(
        option.btnCfg,
        { triggerType: BSN_TRIGGER_TYPE.STATE, trigger: BSN_DATAGRID_TRIGGER.CANCEL_EDIT_ROW },
        this.config.id,
      );
    });
    return true;
  }

  public cancelEditRow(option) {
    if (option.data) {
      const itemId = option.data.data[this.KEY_ID];
      if (itemId) {
        this.ROWS_EDITED = this.ROWS_EDITED.filter((r) => r[this.KEY_ID] !== itemId);
      }
      // 2020.7.27 ???????????????
      if (this.config.mergeconfig) {
        this._createMapd_new(this.config.mergeconfig, this.dataList);
      }
    }

    console.log('-------------', this.ROWS_ADDED, this.ROWS_EDITED);
    // ??????????????????,???????????????????????????,?????????????????????????????????????????????
    // return true ??????????????????, return false ???????????????,????????????????????????

    return true;
  }

  public changeAddedRowsToText(option) {
    console.log('changeAddedRowsToText', option);
    // ???????????????????????????ID??????????????????ID??????????????????
    if (option && Array.isArray(option)) {
      option.map((opt) => {
        if (this.mapOfDataState[opt[this.KEY_ID]]) {
          this.ROWS_ADDED = this.ROWS_ADDED.filter((r) => r[this.KEY_ID] !== opt[this.KEY_ID]);
          this.mapOfDataState[opt[this.KEY_ID]].originData = { ...this.mapOfDataState[opt[this.KEY_ID]].data };
          this.config.rowActions &&
            (this.mapOfDataState[opt[this.KEY_ID]].actions = [...this.config.rowActions.filter((action) => action.state === 'text')]);
          const trigger = new ButtonOperationResolver(this.componentService, this.config, this.mapOfDataState[opt[this.KEY_ID]]);
          trigger.sendBtnMessage(
            {},
            { triggerType: BSN_TRIGGER_TYPE.STATE, trigger: BSN_DATAGRID_TRIGGER.CANCEL_EDIT_ROW },
            this.config.id,
          );
        }
      });
    } else if (option) {
      // this.mapOfDataState[option[this.KEY_ID]].state = 'text';
      this.ROWS_ADDED = this.ROWS_ADDED.filter((r) => r[this.KEY_ID] !== option[this.KEY_ID]);
      this.mapOfDataState[option[this.KEY_ID]].originData = { ...this.mapOfDataState[option[this.KEY_ID]].data };
      this.config.rowActions &&
        (this.mapOfDataState[option[this.KEY_ID]].actions = [...this.config.rowActions.filter((action) => action.state === 'text')]);
      const trigger = new ButtonOperationResolver(this.componentService, this.config, this.mapOfDataState[option[this.KEY_ID]]);
      trigger.sendBtnMessage({}, { triggerType: BSN_TRIGGER_TYPE.STATE, trigger: BSN_DATAGRID_TRIGGER.CANCEL_EDIT_ROW }, this.config.id);
    }
  }

  public changeEditedRowsToText(option) {
    console.log('changeEditedRowsToText', option);
    // ???????????????????????????ID??????????????????ID??????????????????
    if (option && Array.isArray(option)) {
      option.map((opt) => {
        if (this.mapOfDataState[opt[this.KEY_ID]]) {
          this.mapOfDataState[opt[this.KEY_ID]].originData = { ...this.mapOfDataState[opt[this.KEY_ID]].data };
          const trigger = new ButtonOperationResolver(this.componentService, this.config, this.mapOfDataState[opt[this.KEY_ID]]);
          trigger.sendBtnMessage(
            {},
            { triggerType: BSN_TRIGGER_TYPE.STATE, trigger: BSN_DATAGRID_TRIGGER.CANCEL_EDIT_ROW },
            this.config.id,
          );
        }
      });
    } else if (option) {
      // this.mapOfDataState[option[this.KEY_ID]].state = 'text';
      this.mapOfDataState[option[this.KEY_ID]].originData = { ...this.mapOfDataState[option[this.KEY_ID]].data };
      const trigger = new ButtonOperationResolver(this.componentService, this.config, this.mapOfDataState[option[this.KEY_ID]]);
      trigger.sendBtnMessage({}, { triggerType: BSN_TRIGGER_TYPE.STATE, trigger: BSN_DATAGRID_TRIGGER.CANCEL_EDIT_ROW }, this.config.id);
    }
  }

  // #endregion

  // #region operation ????????????
  private _getComponentValueByHttpMethod(method): any[] {
    switch (method) {
      case 'post':
        return this.ROWS_ADDED;
      case 'put':
        return this.ROWS_EDITED;
      case 'proc':
        return [...this.ROWS_ADDED, ...this.ROWS_EDITED];
    }
  }

  public executeHttpRequest(url, method, paramData, logInfo?: any): any {
    let _header = {};
    if (logInfo) {
      const logInfoStr = JSON.stringify(logInfo);
      const dd = encodeURI(logInfoStr);
      _header = new HttpHeaders({
        _log: dd,
      });
    }
    switch (method) {
      case 'get':
        return this.componentService.apiService[method](url, paramData, { headers: _header });
      default:
        return this.componentService.apiService[method](url, paramData, {}, { headers: _header });
    }
  }

  public deleteCheckedRows(option) {
    console.log(this.config.id + '-------------executeSelectRow', option);
    if (option && option.ids) {
      option.ids.split(',').map((id) => {
        this.dataList = this.dataList.filter((d) => d[this.KEY_ID] !== id);
      });
    }
    if (this.dataList.length > 0) {
      this.setSelectRow(this.dataList[0]);
    }
    this.total = this.dataList.length;
  }

  public async deleteCurrentRow(option) {
    console.log(this.config.id + '-------------executeSelectRow', option);
    if (option && option[this.KEY_ID]) {
      this.dataList = this.dataList.filter((d) => d[this.KEY_ID] !== option[this.KEY_ID]);
    }
    if (this.dataList.length > 0) {
      this.setSelectRow(this.dataList[0]);
    }

    this.total = this.dataList.length;
    // const url = option.ajaxConfig.url;
    // const method = option.ajaxConfig.ajaxType ? option.ajaxConfig.ajaxType : 'delete';
    // const ajaxParams = option.ajaxConfig.params ? option.ajaxConfig.params : []
    // let paramData;
    // if (option.data) {
    //     paramData = ParameterResolver.resolve({
    //         params: ajaxParams,
    //         item: option.data.data?option.data.data:option.data,
    //         tempValue: this.tempValue,
    //         initValue: this.initValue,
    //         cacheValue: this.cacheValue
    //     });
    // }
    // const response = await this.executeHttpRequest(url, method, paramData);
    // if (response) {
    //     this.load();
    // }
  }

  /**
   *
   * @param option
   * @returns
   * logging finish
   */
  public async executeCurrentRow(option) {
    console.log('executeCurrentRow');
    let response: any;
    if (option.ajaxConfig['enableAjaxMore']) {
      if (option['data'] && option['data']['data']) {
        response = await this.executeHttpMore(option.ajaxConfig, option['data']['data'], 'buildParameters', null);
      } else {
        response = await this.executeHttpMore(option.ajaxConfig, {}, 'buildParameters', null);
      }
    } else {
      const url = option.ajaxConfig.url;
      const method = option.ajaxConfig.ajaxType;
      const ajaxParams = option.ajaxConfig.params ? option.ajaxConfig.params : [];
      let paramData;
      if (option.data) {
        paramData = ParameterResolver.resolve({
          params: ajaxParams,
          item: option.data.data ? option.data.data : option.data,

          selectedRow: this.ROW_SELECTED,
          router: this.routerValue,
          addedRows: this.ROWS_ADDED,
          editedRows: this.ROWS_EDITED,
          checkedRow: this.ROWS_CHECKED,
          tempValue: this.tempValue,
          initValue: this.initValue,
          cacheValue: this.cacheValue,
          currentRow: this.ROW_CURRENT,
          userValue: this.userValue,
        });
      }
      response = await this.executeHttpRequest(url, method, paramData, option.logInfo).toPromise();
    }
    if (response) {
      // ??????????????????,??????????????????????????????????????????,???????????????????????????????????? {}
      this._sendDataSuccessMessage(response, option.ajaxConfig.result);

      // ??????validation??????
      const validationResult = this._sendDataValidationMessage(response, option.ajaxConfig.result);

      // ??????error??????
      const errorResult = this._sendDataErrorMessage(response, option.ajaxConfig.result);

      return validationResult && errorResult;
    }
  }

  private _sendDataSuccessMessage(response, resultCfg): boolean {
    debugger;
    let result = false;
    if (Array.isArray(response.data) && response.data.length <= 0) {
      return result;
    }
    if (response && response.data) {
      const successCfg = resultCfg.find((res) => res.name === 'data');
      // ???????????????
      if (successCfg) {
        new RelationResolver(this).resolveInnerSender(successCfg, response.data, Array.isArray(response.data));
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
        new RelationResolver(this).resolverDataValidationSender(validationCfg, response.validation);
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
        new RelationResolver(this).resolverDataErrorSender(errorCfg, response.error);
      }
      result = false;
    }
    return result;
  }

  /**
   *
   * @param option
   * @returns
   * logging finish
   */
  public async saveRow(option) {
    debugger;
    const ajaxConfig = option.ajaxConfig;
    const rowData = option.data.data ? option.data.data : option.data;
    const url = ajaxConfig.url;
    const paramData = ParameterResolver.resolve({
      params: ajaxConfig.params,
      tempValue: this.tempValue,
      componentValue: rowData,
      item: this.ROW_SELECTED,
      currentRow: this.ROW_CURRENT,
      initValue: this.initValue,
      cacheValue: this.cacheValue,
      router: this.routerValue,
      selectedRow: this.ROW_SELECTED,
      addedRows: this.ROWS_ADDED,
      editedRows: this.ROWS_EDITED,
      checkedRow: this.ROWS_CHECKED,
      userValue: this.userValue,
    });

    const response = await this.executeHttpRequest(url, ajaxConfig.ajaxType, paramData, option.logInfo).toPromise();
    // const response = await this.componentService.apiService[ajaxConfig.ajaxType](url, paramData).toPromise();

    // ??????????????????,??????????????????????????????????????????,???????????????????????????????????? {}
    this._sendDataSuccessMessage(response, ajaxConfig.result);

    // ??????validation??????
    const validationResult = this._sendDataValidationMessage(response, ajaxConfig.result);

    // ??????error??????
    const errorResult = this._sendDataErrorMessage(response, ajaxConfig.result);

    // ??????true????????????????????????, ??????false????????????,??????????????????????????????????????????
    return validationResult && errorResult;
  }

  /**
   * ???????????????
   * @param options ajaxConfig
   * logging finish
   */
  public async saveRows(option) {
    debugger;
    const ajaxConfig = option.ajaxConfig;
    // ??????????????????
    // ??????????????????
    const url = ajaxConfig.url;
    this.COMPONENT_VALUE = this._getComponentValueByHttpMethod(ajaxConfig.ajaxType);
    const paramsData = this.buildParameters(ajaxConfig.params, this.COMPONENT_VALUE, true);
    const response = await this.executeHttpRequest(url, ajaxConfig.ajaxType, paramsData, option.logInfo).toPromise();
    //const response = await this.componentService.apiService[ajaxConfig.ajaxType](url, paramsData).toPromise();
    // ??????????????????,??????????????????????????????????????????,???????????????????????????????????? {}
    this._sendDataSuccessMessage(response, ajaxConfig.result);

    // ??????validation??????
    const validationResult = this._sendDataValidationMessage(response, ajaxConfig.result);

    // ??????error??????
    const errorResult = this._sendDataErrorMessage(response, ajaxConfig.result);

    // ??????true????????????????????????, ??????false????????????,??????????????????????????????????????????
    return validationResult && errorResult;
  }

  public setSelectRow1(rowData?, $event?) {
    if (!rowData) {
      return false;
    }
    if ($event) {
      const src = $event.srcElement || $event.target;
      if (src.type !== undefined) {
        return false;
      }
      $event.stopPropagation();
      $event.preventDefault();
    }
    if (!rowData) {
      if (this.dataList.length > 0) {
        this.dataList.map((row) => {
          this.mapOfDataState[row[this.KEY_ID]].selected = false;
          this.mapOfDataState[row[this.KEY_ID]].checked = false;
        });

        const key = this.dataList[0][this.KEY_ID];
        this.mapOfDataState[key].selected = true;
        this.mapOfDataState[key].checked = true;
        // ??????/???????????????????????????

        this.dataCheckedStatusChange();
      }
      // return false;
    } else {
      this.ROW_SELECTED = rowData;

      // ???????????????
      if (this.dataList.length > 0) {
        this.dataList.map((row) => {
          this.mapOfDataState[row[this.KEY_ID]].selected = false;
          this.mapOfDataState[row[this.KEY_ID]].checked = false;
        });

        if (rowData[this.KEY_ID] && rowData[this.KEY_ID].length > 0) {
          this.mapOfDataState[rowData[this.KEY_ID]].selected = true;
          this.mapOfDataState[rowData[this.KEY_ID]].checked = true; // !this.mapOfDataState[rowData[this.KEY_ID]]['checked'];
        }

        // ??????/???????????????????????????

        this.dataCheckedStatusChange();
      }
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
        // ????????/???????????????????????????

        this.dataCheckedStatusChange();
      }
      // ??return??false;
    } else {
      this.ROW_SELECTED = rowData;

      // ?????????????????
      if (this.dataList.length > 0) {
        this.dataList.map((row) => {
          this.mapOfDataState[row[this.KEY_ID]].selected = false;
          this.mapOfDataState[row[this.KEY_ID]].checked = false;
        });

        if (rowData[this.KEY_ID] && rowData[this.KEY_ID].length > 0) {
          this.mapOfDataState[rowData[this.KEY_ID]].selected = true;
          this.mapOfDataState[rowData[this.KEY_ID]].checked = true; // ??!this.mapOfDataState[rowData[this.KEY_ID]]['checked'];
        }

        // ????????/???????????????????????????

        this.dataCheckedStatusChange();
      }
    }
    return true;
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

  public selectRow(rowData) {
    console.log(this.config.id + '-----------' + rowData, arguments);
    // this.ROW_SELECTED = rowData;
  }

  // #endregion

  // #region action

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

        // liu 20200818 ?????????????????????????????????????????????????????????

        // liu 20200525
        const mapData = this.mapOfDataState[newData[this.KEY_ID]];
        if (mapData) {
          mapData.state = 'text';
          mapData.actions = this.getRowActions('text');
          mapData.data = newData;
          mapData.originData = { ...newData };
        } else {
          // ??????????????????
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
    // ??????dataList
    // ??????mapOfDataState

    this.dataList.forEach((item, idx) => {
      this.mapOfDataState[item[this.KEY_ID]].originData._index = idx + 1;
      // item[this.KEY_ID]
      item._index = idx + 1;
    });
    // liu 20200818
    this.dataCheckedStatusChange();
  }

  // liu 20200818 ???????????????????????????????????????
  public rows_Add_Edit(item?) {
    this.ROWS_ADDED = this.ROWS_ADDED.filter((r) => r[this.KEY_ID] !== item[this.KEY_ID]);
    this.ROWS_EDITED = this.ROWS_EDITED.filter((r) => r[this.KEY_ID] !== item[this.KEY_ID]);
    // this.dataCheckedStatusChange();
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

  public checkedRows() {
    console.log('-------------checked rows');
    // this._sender_source$.subscribe(res => {
    //     console.log('send message', res);
    // });
  }

  public buildParameters(paramsCfg, data?, isArray = false) {
    let parameterResult: any | any[];
    if (!isArray && !data) {
      parameterResult = ParameterResolver.resolve({
        params: paramsCfg,
        tempValue: this.tempValue,
        componentValue: this.COMPONENT_VALUE,
        item: this.ROW_SELECTED,
        initValue: this.initValue,
        cacheValue: this.cacheValue,
        router: this.routerValue,
        addedRows: this.ROWS_ADDED,
        editedRows: this.ROWS_EDITED,
        checkedRow: this.ROWS_CHECKED,
        outputValue: data,
        returnValue: data,
        selectedRow: this.ROW_SELECTED,
        currentRow: this.ROW_CURRENT,
        userValue: this.userValue,
        menuValue: this.componentService.cacheService.getNone('activeMenu') ? this.componentService.cacheService.getNone('activeMenu') : {},
      });
    } else if (!isArray && data) {
      if (data._procedure_resultset_1) {
        data = { ...data._procedure_resultset_1[0], ...data };
      }
      parameterResult = ParameterResolver.resolve({
        params: paramsCfg,
        tempValue: this.tempValue,
        componentValue: this.COMPONENT_VALUE,
        item: data,
        initValue: this.initValue,
        cacheValue: this.cacheValue,
        router: this.routerValue,
        addedRows: data,
        editedRows: data,
        validation: data,
        returnValue: data,
        checkedRow: this.ROWS_CHECKED,
        outputValue: data,
        selectedRow: this.ROW_SELECTED,
        currentRow: this.ROW_CURRENT,
        userValue: this.userValue,
        menuValue: this.componentService.cacheService.getNone('activeMenu') ? this.componentService.cacheService.getNone('activeMenu') : {},
      });
    } else if (isArray && data && Array.isArray(data)) {
      parameterResult = [];
      data.map((d) => {
        const param = ParameterResolver.resolve({
          params: paramsCfg,
          tempValue: this.tempValue,
          componentValue: d,
          item: d,
          initValue: this.initValue,
          cacheValue: this.cacheValue,
          router: this.routerValue,
          addedRows: d,
          editedRows: d,
          validation: d,
          returnValue: d,
          checkedRow: this.ROWS_CHECKED,
          outputValue: data,
          currentRow: this.ROW_CURRENT,
          userValue: this.userValue,
          menuValue: this.componentService.cacheService.getNone('activeMenu')
            ? this.componentService.cacheService.getNone('activeMenu')
            : {},
        });
        parameterResult.push(param);
      });
    }
    return parameterResult;
  }

  public getCurrentComponentId() {
    return this.config.id;
  }

  /**
   *
   * @param option
   * @returns
   * logging finish
   */
  public async executeSelectRow(option) {
    console.log(this.config.id + '-------------executeSelectRow', option);
    const ajaxParams = option.ajaxConfig.params ? option.ajaxConfig.params : [];
    const paramData = this._createSelectedRowParameter(ajaxParams);
    const result = await this._executeAjax(option, paramData);
    return result;
  }

  /**
   *
   * @param option
   * @param paramData
   * @returns
   * loggin finish
   */
  private async _executeAjax(option: any, paramData: any) {
    const url = option.ajaxConfig.url;
    const method = option.ajaxConfig.ajaxType;

    const response = await this.executeHttpRequest(url, method, paramData ? paramData : {}, option.logInfo).toPromise();
    // ??????????????????,??????????????????????????????????????????,???????????????????????????????????? {}
    this._sendDataSuccessMessage(response, option.ajaxConfig.result);

    // ??????validation??????
    const validationResult = this._sendDataValidationMessage(response, option.ajaxConfig.result);

    // ??????error??????
    const errorResult = this._sendDataErrorMessage(response, option.ajaxConfig.result);

    return validationResult && errorResult;
  }

  private _createSelectedRowParameter(ajaxParams) {
    return ParameterResolver.resolve({
      params: ajaxParams,
      item: this.ROW_SELECTED,
      tempValue: this.tempValue,
      initValue: this.initValue,
      cacheValue: this.cacheValue,
      selectedRow: this.ROW_SELECTED,
      userValue: this.userValue,
    });
  }

  /**
   *
   * @param option
   * @returns
   * loggin
   */
  public async executeCheckedRows(option) {
    console.log(this.config.id + '-------------executeCheckedRows', option);
    const ajaxParams = option.ajaxConfig.params ? option.ajaxConfig.params : [];

    const paramData = this._createCheckedRowsParameter(ajaxParams);
    console.log('executeCheckedRows params', paramData);
    const result = await this._executeAjax(option, paramData);
    return result;
  }

  private _createCheckedRowsParameter(ajaxParams) {
    const params = [];
    if (this.ROWS_CHECKED.length > 0) {
      this.ROWS_CHECKED.map((cr) => {
        const p = ParameterResolver.resolve({
          params: ajaxParams,
          checkedItem: cr,
          tempValue: this.tempValue,
          initValue: this.initValue,
          cacheValue: this.cacheValue,
          userValue: this.userValue,
        });
        params.push(p);
      });
    }
    return params;
  }

  /**
   *
   * @param option
   * @returns
   * logging
   */
  public async executeCheckedRowsIds(option) {
    console.log(this.config.id + '-------------executeCheckedRowsIds', option);
    const ajaxParams = option.ajaxConfig.params ? option.ajaxConfig.params : [];
    const ajaxParams_1 = [{ name: this.KEY_ID, type: 'item', valueName: this.KEY_ID }];
    const paramDataids = this._createCheckedRowsIdParameter(ajaxParams_1);
    let paramData;
    paramData = ParameterResolver.resolve({
      params: ajaxParams,
      item: paramDataids,
      checkedItem: paramDataids,
      tempValue: this.tempValue,
      initValue: this.initValue,
      cacheValue: this.cacheValue,
      userValue: this.userValue,
    });
    const result = await this._executeAjax(option, paramData);
    return result;
  }

  private _createCheckedRowsIdParameter(ajaxParams) {
    const params = [];
    if (this.ROWS_CHECKED.length > 0) {
      this.ROWS_CHECKED.map((cr) => {
        const p = ParameterResolver.resolve({
          params: ajaxParams,
          checkedItem: cr,
          item: cr,
          tempValue: this.tempValue,
          initValue: this.initValue,
          cacheValue: this.cacheValue,
          userValue: this.userValue,
        });
        params.push(p[this.KEY_ID]);
      });
    }
    return { ids: params.join(',') };
  }

  public searchRow() {
    console.log(this.config.id + '-------------searchRow');
  }

  public cancelSearchRow() {
    console.log(this.config.id + '-------------cancelSearchRow');
  }

  public export() {}

  public import() {}

  public download() {}

  /**
   *
   * @param option option.linkConfig -> {id: '', link: '', params:[{name: '', type:'', valueName: ''}]}
   */
  public link(option) {
    let url;
    let params;
    if (option && option.linkConfig) {
      if (option.linkConfig.link) {
        url = option.linkConfig.link;
      }

      if (option.linkConfig.params && Array.isArray(option.linkConfig.params)) {
        params = this.buildParameters(option.linkConfig.params, option.data.originData ? option.data.originData : option.data);
        url = `${url}/${params.ID}`;
      }
      if (url && params) {
        this.componentService.router.navigate([url], { queryParams: { ...params } });
      } else if (url) {
        this.componentService.router.navigate([url]);
      }
    } else {
      console.log('error');
    }
    // this.componentService.router.navigate([option.link], { queryParams: { ...option.data.originData } });
    // this.componentService.activeRoute
    // this.router.navigate(['../home'],{relativeTo:this.route});
  }

  public linkTo(option) {}

  /**
   * ?????????????????????????????????????????????????????? changValue ??? ?????????????????????
   * @param option
   */
  public linkToSub(option?) {
    // let params = this.buildParameters(option.linkConfig.params, option.data.originData ? option.data.originData : option.data);
    // let item;
    // new RelationResolver(this)
    // .resolveInnerSender(
    //     item.sender,
    //     params,
    //     Array.isArray(params)
    // );
  }

  /**
   * ACTION
   * ?????????????????????
   * @param option ????????????
   */
  public showConfirm(option: any) {
    this.confirm(option.dialog, () => {
      this.executeCurrentRow(option);
    });
  }

  /**
   * ACTION
   * @param option
   */
  public showCheckedItemsIdsConfirm(option: any) {
    this.confirm(option.dialog, () => {
      this.executeCheckedRowsIds(option);
    });
  }

  /**
   * ACTION
   * @param option
   */
  public showCheckedItems(option: any) {
    this.confirm(option.dialog, () => {
      this.executeCheckedRows(option);
    });
  }

  /**
   * ?????????????????????
   * @param option ????????????
   * dialog
   * changeValue
   * ajaxConfig
   */
  public showDialog(option: any) {
    let dialog;
    // ???????????????????????????????????????
    const dialogCfg = option.dialog;
    dialogCfg.form.state = option.btnCfg.state ? option.btnCfg.state : 'text';

    // const isEditForm = dialogCfg.form.state === 'edit' ? true : false;
    // if(isEditForm) {

    // }

    const ajaxParams_1 = [{ name: this.KEY_ID, type: 'item', valueName: this.KEY_ID }];
    const paramDataids = this._createCheckedRowsIdParameter(ajaxParams_1);

    if (this.config.isApproval) {
      const changeValue: any[] = this.componentService.cacheService.getNone('ApprovalChangeValue')
        ? this.componentService.cacheService.getNone('ApprovalChangeValue')
        : [];
      if (changeValue.length > 0) {
        if (option.changeValue) {
          option.changeValue.params = [...option.changeValue.params, ...changeValue[0].params];
        } else {
          option['changeValue'] = changeValue[0];
        }
      }
      // this.componentService.cacheService.remove('ApprovalChangeValue')
    }

    if (option.changeValue) {
      const d = ParameterResolver.resolve({
        params: option.changeValue.params,
        tempValue: this.tempValue,
        // componentValue: cmptValue,
        item: option.data.data ? option.data.data : option.data,
        checkedItem: paramDataids,
        selectedRow: this.ROW_SELECTED,
        addedRows: this.ROWS_ADDED,
        editedRows: this.ROWS_EDITED,
        checkedRow: this.ROWS_CHECKED,
        initValue: this.initValue,
        cacheValue: this.cacheValue,
        router: this.routerValue,
        userValue: this.userValue,
      });
      option.changeValue.params.map((param) => {
        if (param.type === 'value') {
          // ?????????value?????????????????????????????????????????????
        } else {
          if (d[param.name]) {
            param.value = d[param.name];
          }
        }
      });
    }
    const dialogOptional = {
      nzTitle: dialogCfg.title ? dialogCfg.title : '',
      nzWidth: dialogCfg.width ? dialogCfg.width : '600px',
      nzStyle: dialogCfg.style ? dialogCfg.style : null, // style{top:'1px'},
      nzMaskClosable: dialogCfg.hasOwnProperty('maskClosable') ? dialogCfg.maskClosable : false,
      nzContent: components[dialogCfg.form.type],
      nzComponentParams: {
        config: dialogCfg.form,
        changeValue: option.changeValue ? option.changeValue.params : [],
        dialogsConfig: this.config.dialog,
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
            (async () => {
              const response = await componentInstance.executeModal(option);
              if (response) {
                this._sendDataSuccessMessage(response, option.ajaxConfig.result);

                // ??????validation??????
                this._sendDataValidationMessage(response, option.ajaxConfig.result) &&
                  this._sendDataErrorMessage(response, option.ajaxConfig.result) &&
                  dialog.close();
              }
            })();
          },
        },
      ],
    };
    dialog = this.componentService.modalService.create(dialogOptional);
  }

  public showWindow(option: any) {
    let dialog;
    // ???????????????????????????????????????
    const dialogCfg = option.window;
    // dialogCfg.form.state = option.btnCfg.state ? option.btnCfg.state : 'text';

    // const isEditForm = dialogCfg.form.state === 'edit' ? true : false;
    // if(isEditForm) {

    // }

    const ajaxParams_1 = [{ name: this.KEY_ID, type: 'item', valueName: this.KEY_ID }];
    const paramDataids = this._createCheckedRowsIdParameter(ajaxParams_1);

    if (option.changeValue) {
      const d = ParameterResolver.resolve({
        params: option.changeValue.params,
        tempValue: this.tempValue,
        // componentValue: cmptValue,
        item: option.data.data ? option.data.data : option.data,
        selectedRow: this.ROW_SELECTED,
        checkedItem: paramDataids,
        addedRows: this.ROWS_ADDED,
        editedRows: this.ROWS_EDITED,
        checkedRow: this.ROWS_CHECKED,
        initValue: this.initValue,
        cacheValue: this.cacheValue,
        router: this.routerValue,
        userValue: this.userValue,
      });
      option.changeValue.params.map((param) => {
        if (param.type === 'value') {
          // ?????????value?????????????????????????????????????????????
        } else {
          if (d[param.name]) {
            param.value = d[param.name];
          }
        }
      });
    }

    const dialogOptional = {
      nzTitle: dialogCfg.title ? dialogCfg.title : '',
      nzWidth: dialogCfg.width ? dialogCfg.width : '600px',
      nzStyle: dialogCfg.style ? dialogCfg.style : null, // style{top:'1px'},
      nzMaskClosable: dialogCfg.hasOwnProperty('maskClosable') ? dialogCfg.maskClosable : false,
      nzContent: CnPageComponent,
      nzComponentParams: {
        config: {},
        customPageId: dialogCfg.layoutName, // "0MwdEVnpL0PPFnGISDWYdkovXiQ2cIOG",
        // initData:this.initData
        changeValue: option.changeValue ? option.changeValue.params : [],
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
            dialog.close();
            /*   (async () => {
                              const response = await componentInstance.executeModal(option);
                              this._sendDataSuccessMessage(response, option.ajaxConfig.result);
  
                              // ??????validation??????
                              this._sendDataValidationMessage(response, option.ajaxConfig.result)
                                  &&
                                  this._sendDataErrorMessage(response, option.ajaxConfig.result)
                                  && dialog.close();
                          })(); */
          },
        },
      ],
    };
    // ????????? ????????????
    if (dialogCfg.footerButton && dialogCfg.footerButton.length > 0) {
      dialogOptional.nzFooter = [];

      dialogCfg.footerButton.forEach((_button) => {
        dialogOptional.nzFooter.push({
          label: _button.text,
          onClick: (componentInstance) => {
            // dialog.close();
            // customAction
            let customAction;
            if (dialogCfg.customAction && dialogCfg.customAction.length > 0) {
              const customActionList = dialogCfg.customAction.filter((item) => item.id === _button.customActionId);
              if (customActionList && customActionList.length > 0) {
                customAction = customActionList[0];
              }
            }

            this.execCustomAction(customAction, dialog, componentInstance);
          },
        });
      });
    }

    dialog = this.componentService.modalService.create(dialogOptional);
    this.windowDialog = dialog;
  }
  // ??????????????????????????????
  public execCustomAction(customAction?, dialog?, componentInstance?) {
    console.log('execCustomAction');

    customAction.execute.forEach((item) => {
      if (item.type === 'relation') {
        new RelationResolver(this).resolveInnerSender(item.sender, {}, Array.isArray({}));
      } else if (item.type === 'action') {
        this.windowDialog.close();
      }
    });

    // new RelationResolver(this). resolveSender();

    return true;
  }

  /**
   * ???????????????????????????????????????????????????
   * @param option
   */
  executePopupClose(option?) {
    console.log('????????????executeShowClose', option);
    // ???????????? ??????????????????????????????????????????????????????????????????????????????????????? popup

    if (this.windowDialog) {
      this.windowDialog.close(); // ????????????
      this.windowDialog = null;
    }

    return true;
  }

  public showUpload(option: any) {
    // CnUploadComponent
    console.log('??????', option);
    let dialog;
    // ???????????????????????????????????????
    const dialogCfg = option.window;
    // dialogCfg.form.state = option.btnCfg.state ? option.btnCfg.state : 'text';

    // const isEditForm = dialogCfg.form.state === 'edit' ? true : false;
    // if(isEditForm) {

    // }
    if (option.changeValue) {
      const d = ParameterResolver.resolve({
        params: option.changeValue.params,
        tempValue: this.tempValue,
        // componentValue: cmptValue,
        item: option.data,
        selectedRow: this.ROW_SELECTED,
        addedRows: this.ROWS_ADDED,
        editedRows: this.ROWS_EDITED,
        checkedRow: this.ROWS_CHECKED,
        initValue: this.initValue,
        cacheValue: this.cacheValue,
        router: this.routerValue,
        userValue: this.userValue,
      });
      option.changeValue.params.map((param) => {
        if (param.type === 'value') {
          // ?????????value?????????????????????????????????????????????
        } else {
          if (d[param.name]) {
            param.value = d[param.name];
          }
        }
      });
    }

    const dialogOptional = {
      nzTitle: dialogCfg.title ? dialogCfg.title : '',
      nzWidth: dialogCfg.width ? dialogCfg.width : '600px',
      nzStyle: dialogCfg.style ? dialogCfg.style : null, // style{top:'1px'},
      nzContent: CnPageComponent,
      nzComponentParams: {
        config: {},
        customPageId: dialogCfg.layoutName, // "0MwdEVnpL0PPFnGISDWYdkovXiQ2cIOG",
        // initData:this.initData
        changeValue: option.changeValue ? option.changeValue.params : [],
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
            dialog.close();
            /*   (async () => {
                              const response = await componentInstance.executeModal(option);
                              this._sendDataSuccessMessage(response, option.ajaxConfig.result);
  
                              // ??????validation??????
                              this._sendDataValidationMessage(response, option.ajaxConfig.result)
                                  &&
                                  this._sendDataErrorMessage(response, option.ajaxConfig.result)
                                  && dialog.close();
                          })(); */
          },
        },
      ],
    };
    dialog = this.componentService.modalService.create(dialogOptional);
  }

  public showBatchDialog() {}

  /**
   * ???????????????
   */
  public showMessage(option) {
    let msgObj;
    if (option && Array.isArray(option)) {
      // ??????????????????????????????????????????????????????
      msgObj = this.buildMessageContent(option[0]);
    } else if (option) {
      msgObj = this.buildMessageContent(option);
    }
    option && this.componentService.msgService.create(msgObj.type, `${msgObj.message}`);
  }

  public buildMessageContent(msgObj) {
    const message: any = {};
    let array: any[];
    if (msgObj.type) {
    } else {
      array = msgObj.message.split(':');
    }

    if (!array) {
      if (msgObj.code) {
        message.message = msgObj.code;
      } else if (msgObj.message) {
        message.message = msgObj.message;
      }
      // message.message = option.code ? option.code : '';
      msgObj.field && (message.field = msgObj.field ? msgObj.field : '');
      message.type = msgObj.type;
    } else {
      message.type = array[0];
      message.message = array[1];
    }
    return message;
  }

  /**
   * ??????
   */
  public checkAll($value: boolean): void {
    //
    this.dataList
      .filter((item) => !this.mapOfDataState[item[this.KEY_ID]].disabled)
      .map((item) => (this.mapOfDataState[item[this.KEY_ID]].checked = $value));
    this.dataCheckedStatusChange();
  }

  /**
   * ???????????????????????????CheckBox
   */
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

      // ??????????????????????????????
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

  /**
   * ?????????
   * @param $sort {key:string, value: string}
   */
  sort($sort: { key: string; value: string }): void {
    this._sortName = $sort.key;
    this._sortValue = $sort.value;
    this.load();
  }

  searchData(reset: boolean = false) {
    if (reset) {
      this.pageIndex = 1;
    }
    this.isAllChecked = false;
    this.indeterminate = false;
    this.load();
  }

  //#endregion

  /**
   *
   * @param actionCfg ???????????????????????????
   * @param rowData ???????????????
   * @param $event
   */
  rowAction(actionCfg, rowData, $event?) {
    const dataOfState = this.mapOfDataState[rowData[this.KEY_ID]];
    this.ROW_CURRENT = dataOfState.originData;
    $event && $event.stopPropagation();
    const trigger = new ButtonOperationResolver(this.componentService, this.config, dataOfState);
    const logInfo = this.getLogInfo(this, [actionCfg]);
    if (logInfo) {
      actionCfg.logInfo = logInfo;
    }
    trigger.toolbarAction(actionCfg, this.config.id);
    $event && $event.preventDefault();
  }

  getRowActions(state): any[] {
    const orginAction = this.tableColumns.find((c) => c.type === 'action');
    const copyAction = [];
    if (orginAction) {
      if (this.tableColumns.find((c) => c.type === 'action').action) {
        const actions = JSON.parse(
          JSON.stringify(this.tableColumns.find((c) => c.type === 'action').action.filter((c) => c.state === state)),
        );
        copyAction.push(...actions);
      }
    }
    return copyAction;
  }
  public valueChange(v?) {
    console.log('?????????', v);
    this.mapOfDataState[v.id].data[v.name] = v.value;
    if (v.id) {
      if (!this.formCascade[v.id]) {
        this.formCascade[v.id] = {};
      }
      this.formCascade[v.id][v.name] = {};
    }

    const triggerKey = v.name;

    if (this.config.cascadeValue) {
      const cascade_arry = this.config.cascadeValue.filter((item) => item.name === triggerKey);
      let cascade;
      if (cascade_arry.length > 0) {
        cascade = cascade_arry[0];

        // this.config.cascadeValue.forEach(cascade => {
        //     if (cascade.name !== triggerKey) {
        //       //  return false;
        //     }
        // console.log('==****??????????????????*****==', cascade);
        cascade.CascadeObjects.forEach((cascadeObj) => {
          if (!this.formCascade[v.id][cascadeObj.cascadeName]) {
            this.formCascade[v.id][cascadeObj.cascadeName] = {};
          }
          const cascadeResult = this.formCascade[v.id][cascadeObj.cascadeName]; // ??????????????????
          cascadeResult[cascadeObj.cascadeName] = {};
          cascadeObj.cascadeItems.forEach((item) => {
            let regularflag = true;
            if (item.caseValue && item.type === 'condition') {
              const reg1 = new RegExp(item.caseValue.regular);
              let regularData;
              if (item.caseValue.type) {
                if (item.caseValue.regularType === 'value') {
                  regularData = item.caseValue.value;
                }
                if (item.caseValue.type === 'selectValue') {
                  // ???????????????[???????????????]
                  regularData = v.value;
                }
                if (item.caseValue.type === 'selectObjectValue') {
                  // ?????????????????????
                  if (v.dataItem) {
                    regularData = v.dataItem[item.caseValue.valueName];
                  }
                }
                if (item.caseValue.type === 'rowValue') {
                  // ?????????????????????
                  if (this.mapOfDataState[v.id].data) {
                    regularData = this.mapOfDataState[v.id].data[item.caseValue.valueName];
                  }
                }
              } else {
                regularData = v.value;
              }
              regularflag = reg1.test(regularData);
            }

            // ????????????
            if (regularflag) {
              // ??????????????????????????? ?????????default
              if (item.content.type === 'ajax') {
                const _cascadeValue = {};
                item.content.data.option.forEach((ajaxItem) => {
                  if (ajaxItem.type === 'value') {
                    _cascadeValue[ajaxItem.name] = ajaxItem.value;
                  }
                  if (ajaxItem.type === 'selectValue') {
                    // ???????????????[???????????????]
                    _cascadeValue[ajaxItem.name] = v.value;
                  }
                  if (ajaxItem.type === 'selectObjectValue') {
                    // ?????????????????????
                    if (v.dataItem) {
                      _cascadeValue[ajaxItem.name] = v.dataItem[ajaxItem.valueName];
                    }
                  }
                  // ????????????????????????????????????
                });
                if (cascadeResult[cascadeObj.cascadeName].hasOwnProperty('cascadeValue')) {
                  cascadeResult[cascadeObj.cascadeName].cascadeValue = {
                    ...cascadeResult[cascadeObj.cascadeName].cascadeValue,
                    ..._cascadeValue,
                  };
                } else {
                  cascadeResult[cascadeObj.cascadeName].cascadeValue = { ..._cascadeValue };
                }
                cascadeResult[cascadeObj.cascadeName].exec = 'ajax';
                // this.setValue(cascadeObj.cascadeName, null); // ????????????????????????????????????
              }
              if (item.content.type === 'setOptions') {
                // ???????????????????????? , ??????????????????????????? ?????????
                const _cascadeOptions = item.content.data.option;

                if (cascadeResult[cascadeObj.cascadeName].hasOwnProperty('cascadeOptions')) {
                  cascadeResult[cascadeObj.cascadeName].cascadeOptions = _cascadeOptions;
                } else {
                  cascadeResult[cascadeObj.cascadeName].cascadeOptions = _cascadeOptions;
                }
                cascadeResult[cascadeObj.cascadeName].exec = 'setOptions';
                // this.setValue(cascadeObj.cascadeName, null); // ????????????????????????????????????
              }
              if (item.content.type === 'setValue') {
                let __setValue;
                item.content.data.option.forEach((ajaxItem) => {
                  if (ajaxItem.type === 'value') {
                    __setValue = ajaxItem.value;
                  }
                  if (ajaxItem.type === 'selectValue') {
                    // ???????????????[???????????????]
                    __setValue = v.value;
                  }
                  if (ajaxItem.type === 'selectObjectValue') {
                    // ?????????????????????
                    if (v.dataItem) {
                      __setValue = v.dataItem[ajaxItem.valueName];
                    }
                  }
                  // ????????????????????????????????????
                });

                cascadeResult[cascadeObj.cascadeName].setValue = { value: __setValue };
                cascadeResult[cascadeObj.cascadeName].exec = 'setValue';
                // ??????
                // this.setValue(cascadeObj.cascadeName, __setValue);
                this.mapOfDataState[v.id].data[cascadeObj.cascadeName] = __setValue;
              }
              if (item.content.type === 'compute') {
                let __setValue;
                const computeObj = {};

                item.content.data.option.forEach((ajaxItem) => {
                  if (ajaxItem.type === 'value') {
                    __setValue = ajaxItem.value;
                  }
                  if (ajaxItem.type === 'selectValue') {
                    // ???????????????[???????????????]
                    __setValue = v.value;
                  }
                  if (ajaxItem.type === 'selectObjectValue') {
                    // ?????????????????????
                    if (v.dataItem) {
                      __setValue = v.dataItem[ajaxItem.valueName];
                    }
                  }
                  if (ajaxItem.type === 'rowValue') {
                    // ?????????????????????
                    if (this.mapOfDataState[v.id].data) {
                      __setValue = this.mapOfDataState[v.id].data[ajaxItem.valueName];
                    }
                  }

                  computeObj[ajaxItem.name] = Number(__setValue) ? Number(__setValue) : 0;
                  // ????????????????????????????????????
                });

                const _computeValue = this.L__getComputeSymbol(item.content.compute.expression[0], computeObj);

                cascadeResult[cascadeObj.cascadeName].setValue = { value: _computeValue };
                cascadeResult[cascadeObj.cascadeName].exec = 'setValue';
                this.mapOfDataState[v.id].data[cascadeObj.cascadeName] = _computeValue;
                // cascadeResult[cascadeObj.cascadeName]['computeSetValue'] = { value: _computeValue };
                // cascadeResult[cascadeObj.cascadeName]['exec'] = 'computeSetValue';
                // this.mapOfDataState[v.id]['data'][cascadeObj.cascadeName] = _computeValue;
                // ??????
                // this.setValue(cascadeObj.cascadeName, __setValue);
              }
              if (item.content.type === 'display') {
                // ?????? ????????????????????????????????????????????????????????????????????????????????????????????????
              }
              if (item.content.type === 'message') {
                // ??????????????????????????????????????????????????????????????????????????????????????????????????????
              }
              if (item.content.type === 'changeValue') {
                cascadeResult[cascadeObj.cascadeName].exec = 'changeValue';
              }
              if (item.content.type === 'relation') {
                // ?????????????????????????????????????????????????????????????????????-????????????????????????????????????
                // ?????? ???????????????????????????????????????
                const _cascadeValue = {};
                item.content.data.option.forEach((ajaxItem) => {
                  if (ajaxItem.type === 'value') {
                    _cascadeValue[ajaxItem.name] = ajaxItem.value;
                  }
                  if (ajaxItem.type === 'selectValue') {
                    // ???????????????[???????????????]
                    _cascadeValue[ajaxItem.name] = v.value;
                  }
                  if (ajaxItem.type === 'selectObjectValue') {
                    // ?????????????????????
                    if (v.dataItem) {
                      _cascadeValue[ajaxItem.name] = v.dataItem[ajaxItem.valueName];
                    }
                  }
                  // ????????????????????????????????????
                });

                if (item.content.sender) {
                  new RelationResolver(this).resolveInnerSender(
                    item.content.sender, // ????????????
                    _cascadeValue, // ????????????
                    Array.isArray(_cascadeValue), // ????????????
                  );
                }
              }
              if (item.content.type === 'preventCascade') {
                // ???????????? ??????????????????????????????
              }
            }
          });
          this.formCascade[v.id][cascadeObj.cascadeName] = JSON.parse(JSON.stringify(this.formCascade[v.id][cascadeObj.cascadeName]));
          // console.log('==????????????????????????==', this.formCascade);
        });
        // });
      }
    }
  }

  public L__getComputeSymbol(symbolObj?, computeObj?) {
    let r = 0;
    if (symbolObj.valueName === 'result') {
    }
    if (symbolObj.valueName === '*') {
      r = 1;
      if (symbolObj.children) {
        symbolObj.children.forEach((_item) => {
          // r = r * this.L_getComputeValue(_item, computeObj);
          r = parseFloat((r * this.L_getComputeValue(_item, computeObj)).toFixed(10));
        });
        return r;
      }
      return 0;
    }
    if (symbolObj.valueName === '+') {
      r = 0;
      if (symbolObj.children) {
        symbolObj.children.forEach((_item) => {
          // r = r + this.L_getComputeValue(_item, computeObj);
          r = parseFloat((r + this.L_getComputeValue(_item, computeObj)).toFixed(10));
        });
      }
      return r;
    }
    if (symbolObj.valueName === '-') {
      // r = 0;
      // if (symbolObj.children) {
      //     symbolObj.children.forEach(_item => {
      //         r = r - this.L_getComputeValue(_item, computeObj);
      //     });
      //     r = r+ 2* this.L_getComputeValue(symbolObj.children[0], computeObj);

      // }
      // return r;
      r = 0;
      if (symbolObj.children) {
        r = r + this.L_getComputeValue(symbolObj.children[0], computeObj);
        for (let i = 1; i < symbolObj.children.length; i++) {
          const comput_value = this.L_getComputeValue(symbolObj.children[i], computeObj);
          //  r = r - comput_value;
          r = parseFloat((r - comput_value).toFixed(10));
        }
      }
      return r;
    }
    if (symbolObj.valueName === '/') {
      //
      r = 0.0;
      if (symbolObj.children) {
        r = r + this.L_getComputeValue(symbolObj.children[0], computeObj);
        for (let i = 1; i < symbolObj.children.length; i++) {
          const comput_value = this.L_getComputeValue(symbolObj.children[i], computeObj);
          if (comput_value === 0) {
            return 0;
          }
          //  r = r / comput_value;
          r = parseFloat((r / comput_value).toFixed(10));
        }
      }
      // const dd =  parseFloat((110.0 / 1.1).toFixed(10)) ;

      return r;
    }

    return r;
  }

  public L_getComputeValue(item?, computeObj?) {
    if (item.type === 'symbol') {
      return this.L__getComputeSymbol(item, computeObj);
    }
    if (item.type === 'value') {
      return computeObj[item.valueName] ? computeObj[item.valueName] : 0;
    }
  }
  /**
   * setChangeValue ?????? ???????????????
   */
  public setChangeValue(ChangeValues?) {
    console.log('changeValue', ChangeValues);
    // const ChangeValues = [{ name: "", value: "", valueTo: "" }];
    if (ChangeValues && ChangeValues.length > 0) {
      ChangeValues.forEach((p) => {
        switch (p.valueTo) {
          case 'tempValue':
            this.tempValue[p.name] = p.value;
            break;
          case 'initValue':
            this.initValue[p.name] = p.value;
            break;
          case 'staticComponentValue':
            this.staticComponentValue[p.name] = p.value;
            break;
        }
      });
    }
  }

  public _createMapd_new_old(mergeconfig?, listOfData?) {
    // ??????group??????

    const mergeData = {};

    listOfData.forEach((row) => {
      this.mapOfDataState[row[this.KEY_ID]].mergeData = {}; // ?????????
    });

    // ?????? group ??????????????????  merge

    mergeconfig.rowConfig &&
      mergeconfig.rowConfig.forEach((r_c) => {
        listOfData.forEach((row) => {
          if (!this.mapOfDataState[row[this.KEY_ID]].mergeData[r_c.colName]) {
            this.mapOfDataState[row[this.KEY_ID]].mergeData[r_c.colName] = {};
          }
          let new_data = [...listOfData];
          r_c.groupCols.forEach((group_col) => {
            new_data = new_data.filter((d) => d[group_col.groupColName] === row[group_col.groupColName]);
          });

          new_data = new_data.filter((d) => d[r_c.groupName] === row[r_c.groupName]);
          const group_num = new_data.length;
          const group_index = new_data.findIndex((d) => d[this.KEY_ID] === row[this.KEY_ID]);
          this.mapOfDataState[row[this.KEY_ID]].mergeData[r_c.colName].groupNum = group_num;
          this.mapOfDataState[row[this.KEY_ID]].mergeData[r_c.colName].groupIndex = group_index + 1;
          this.mapOfDataState[row[this.KEY_ID]].mergeData[r_c.colName].colgroupIndex = 1;
          this.mapOfDataState[row[this.KEY_ID]].mergeData[r_c.colName].colgroupNum = 1;
        });
      });

    mergeconfig.colConfig &&
      mergeconfig.colConfig.length > 0 &&
      listOfData.forEach((row) => {
        // this.mapd[row.id]={}; // ?????????

        mergeconfig.colConfig.forEach((col_c) => {
          col_c.mergeItems.forEach((item) => {
            let regularflag = true;
            if (item.caseValue && item.type === 'condition') {
              const reg1 = new RegExp(item.caseValue.regular);
              let regularData;
              if (item.caseValue.type) {
                if (item.caseValue.type === 'value') {
                  regularData = item.caseValue.value;
                }
                if (item.caseValue.type === 'rowValue') {
                  // ?????????????????????
                  if (row) {
                    regularData = row[item.caseValue.valueName];
                  }
                }
              } else {
                regularData = null;
              }
              regularflag = reg1.test(regularData);
            }
            if (regularflag) {
              const group_num = item.mergeCols.length;
              item.mergeCols.forEach((merge_col) => {
                if (!this.mapOfDataState[row[this.KEY_ID]].mergeData[merge_col.mergeColName]) {
                  this.mapOfDataState[row[this.KEY_ID]].mergeData[merge_col.mergeColName] = {};
                }
                const group_index = item.mergeCols.findIndex((d) => d.mergeColName === merge_col.mergeColName);
                this.mapOfDataState[row[this.KEY_ID]].mergeData[merge_col.mergeColName].colgroupIndex = group_index + 1;
                this.mapOfDataState[row[this.KEY_ID]].mergeData[merge_col.mergeColName].colgroupNum = group_num;
              });
            }
          });
        });
      });

    console.log('new??????????????????', this.mapOfDataState);
  }

  public _createMapd_new(mergeconfig?, listOfData?) {
    // ??????group??????

    const mergeData = {};

    listOfData.forEach((row) => {
      this.mapOfDataState[row[this.KEY_ID]].mergeData = {}; // ?????????
    });

    // ?????? group ??????????????????  merge

    mergeconfig.rowConfig &&
      mergeconfig.rowConfig.forEach((r_c) => {
        listOfData.forEach((row) => {
          if (!this.mapOfDataState[row[this.KEY_ID]].mergeData[r_c.colName]) {
            this.mapOfDataState[row[this.KEY_ID]].mergeData[r_c.colName] = {};
          }
          let new_data = [...listOfData];
          r_c.groupCols.forEach((group_col) => {
            // new_data = new_data.filter(d => d[group_col.groupColName] === row[group_col.groupColName]);
            let _SingleEdit = true;
            if (group_col.hasOwnProperty('singleEdit')) {
              _SingleEdit = group_col.singleEdit;
            }
            new_data = [...this._createMapd_array(new_data, group_col.groupColName, row, _SingleEdit)];
            //     console.log('jisuan:',group_col.groupColName,new_data);
          });

          // console.log('??????:',new_data , row[r_c.groupName]);
          // new_data = new_data.filter(d => d[r_c.groupName] === row[r_c.groupName]);
          const group_num = new_data.length;
          const group_index = new_data.findIndex((d) => d[this.KEY_ID] === row[this.KEY_ID]);
          // if(group_index<0){
          //     console.log('????????????',new_data,row[this.KEY_ID])
          // }

          this.mapOfDataState[row[this.KEY_ID]].mergeData[r_c.colName].groupNum = group_num;
          this.mapOfDataState[row[this.KEY_ID]].mergeData[r_c.colName].groupIndex = group_index + 1;
          this.mapOfDataState[row[this.KEY_ID]].mergeData[r_c.colName].colgroupIndex = 1;
          this.mapOfDataState[row[this.KEY_ID]].mergeData[r_c.colName].colgroupNum = 1;
        });
      });

    mergeconfig.colConfig &&
      mergeconfig.colConfig.length > 0 &&
      listOfData.forEach((row) => {
        // this.mapd[row.id]={}; // ?????????

        mergeconfig.colConfig.forEach((col_c) => {
          col_c.mergeItems.forEach((item) => {
            let regularflag = true;
            if (item.caseValue && item.type === 'condition') {
              const reg1 = new RegExp(item.caseValue.regular);
              let regularData;
              if (item.caseValue.type) {
                if (item.caseValue.type === 'value') {
                  regularData = item.caseValue.value;
                }
                if (item.caseValue.type === 'rowValue') {
                  // ?????????????????????
                  if (row) {
                    regularData = row[item.caseValue.valueName];
                  }
                }
              } else {
                regularData = null;
              }
              regularflag = reg1.test(regularData);
            }
            if (regularflag) {
              const group_num = item.mergeCols.length;
              item.mergeCols.forEach((merge_col) => {
                if (!this.mapOfDataState[row[this.KEY_ID]].mergeData[merge_col.mergeColName]) {
                  this.mapOfDataState[row[this.KEY_ID]].mergeData[merge_col.mergeColName] = {};
                }
                const group_index = item.mergeCols.findIndex((d) => d.mergeColName === merge_col.mergeColName);
                this.mapOfDataState[row[this.KEY_ID]].mergeData[merge_col.mergeColName].colgroupIndex = group_index + 1;
                this.mapOfDataState[row[this.KEY_ID]].mergeData[merge_col.mergeColName].colgroupNum = group_num;
              });
            }
          });
        });
      });

    console.log('new??????????????????', this.mapOfDataState);
  }

  /**
   *
   * @param new_data  ????????????
   * @param feildName ????????????
   * @param row       ?????????
   * @param isSingleEdit ????????????????????????????????????
   */
  public _createMapd_array(new_data?, feildName?, row?, isSingleEdit?) {
    // ??????????????????????????? ?????? ???????????????????????????????????????????????????
    // ????????????
    // ?????????????????????????????????????????????????????????????????????
    // 1.??????????????????????????????
    // 1.1 ?????????????????? ??????????????????????????????
    // ??????????????????????????????????????????????????????????????????????????????edit ?????????????????????????????????
    // ??????????????????, ????????????????????????????????????edit?????????????????????????????????????????????
    // ??????????????????????????????????????????????????????????????????????????????
    // ??????????????????
    // 2.????????????????????????????????????????????????

    // 1 ????????????????????????edit????????????
    // state: 'new' 'edit',
    console.log('xxxxxxxxx====>', feildName, new_data);
    new_data.forEach((row) => {
      row.__state__ = this.mapOfDataState[row[this.KEY_ID]].state;
    });

    // 2 ????????????
    // 2.1 ????????????????????????
    const row_index = new_data.findIndex((d) => d[this.KEY_ID] === row[this.KEY_ID]);
    // 2.2 ??????????????????
    const BeforeArr = new_data.slice(0, row_index).reverse();
    const OwnArr = new_data.slice(row_index, row_index + 1);
    const AftertArr = new_data.slice(row_index + 1);

    console.log('xxxxxxxxx??????====>', row_index, BeforeArr, OwnArr, AftertArr);
    // 2.2 ??????????????????
    // reverse() ??????

    let new_BeforeArr = [];
    let Before_index = 0;
    for (let i = 0; i < BeforeArr.length; i++) {
      // ?????????????????????????????????
      if (Before_index === i && BeforeArr[i][feildName] === row[feildName]) {
        if (isSingleEdit) {
          if (BeforeArr[i].__state__ === 'new' || BeforeArr[i].__state__ === 'edit') {
            Before_index = -1;
          } else {
            new_BeforeArr.push(BeforeArr[i]);
            Before_index++;
          }
        } else {
          new_BeforeArr.push(BeforeArr[i]);
          Before_index++;
        }
      } else {
        break;
      }
    }

    let new_AftertArr = [];
    let Aftert_index = 0;
    for (let i = 0; i < AftertArr.length; i++) {
      // ?????????????????????????????????
      if (Aftert_index === i && AftertArr[i][feildName] === row[feildName]) {
        if (isSingleEdit) {
          if (AftertArr[i].__state__ === 'new' || AftertArr[i].__state__ === 'edit') {
            Aftert_index = -1;
          } else {
            new_AftertArr.push(AftertArr[i]);
            Aftert_index++;
          }
        } else {
          new_AftertArr.push(AftertArr[i]);
          Aftert_index++;
        }
      } else {
        break;
      }
    }

    if (isSingleEdit) {
      if (OwnArr[0].__state__ === 'new' || OwnArr[0].__state__ === 'edit') {
        new_BeforeArr = [];
        new_AftertArr = [];
      }
    }

    // 3 ?????????????????????

    let back_data = [];
    back_data = [...new_BeforeArr.reverse(), ...OwnArr, ...new_AftertArr];

    return back_data;
  }

  public transferValue(option?) {
    console.log('?????????????????????', this.tempValue);
  }
  hiddentrue() {
    this.is_hidden = !this.is_hidden;
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
  public executeAnalysisLayout(option?) {
    let pageJson: any;
    let page_id: any;
    // PAGE_JSON
    if (this.ROW_SELECTED) {
      if (this.ROW_SELECTED.PAGE_JSON) {
        pageJson = JSON.parse(this.ROW_SELECTED.PAGE_JSON);
        page_id = this.ROW_SELECTED.ID;
      }
    }

    console.log('???????????????', this.ROW_SELECTED);
    if (pageJson) {
      const f = new PageStructure();
      f.page_id = page_id;
      f.page_config = pageJson;
      f.getPageStructure();
      this.nodes = f.nodes;
      this.ROW_SELECTED.analysisLayout = JSON.stringify(f.ts_new);
    } else {
      this.nodes = [];
    }

    if (option) {
      this.executeCurrentRow(option);
    }
    return true;
  }
  public executeAnalysisLayout_test(option?) {
    this.showTree = true;
    let pageJson: any;
    let page_id: any;
    // PAGE_JSON
    if (this.ROW_SELECTED) {
      if (this.ROW_SELECTED.PAGE_JSON) {
        pageJson = JSON.parse(this.ROW_SELECTED.PAGE_JSON);
        page_id = this.ROW_SELECTED.ID;
      }
    }

    console.log('???????????????', this.ROW_SELECTED);
    if (pageJson) {
      const f = new PageStructure();
      f.page_id = page_id;
      f.page_config = pageJson;
      f.getPageStructure();
      this.nodes = f.nodes;
      // this.ROW_SELECTED['analysisLayout'] = JSON.stringify (f.ts_new);
    } else {
      this.nodes = [];
    }
    return true;
  }

  // public dropRow(event: CdkDragDrop<any>): void {
  //     console.log(event);
  // }

  getLogInfo(that?, arguments1?) {
    const btnOption = arguments1[0];
    const text = btnOption.text;
    let componentId;
    if (btnOption.targetViewId) {
      componentId = btnOption.targetViewId;
    } else {
      componentId = that.config.id;
    }

    // ?????? ??????????????????????????????????????????
    let btnData;
    // ?????????????????????????????????
    btnData = {
      componentId: that.config.id, // ????????????
      targetViewId: componentId, // ??????????????????
      btnId: btnOption.id,
      btnText: btnOption.text,
      description: '[??????]???' + (btnOption.description ? btnOption.description : btnOption.text),
    };
    // ??????????????????????????????
    const logConfig = environment.systemSettings.logInfo.logAjaxConfig;
    const params = that.buildParameters(logConfig.params, btnData, false);
    return { ...btnData, ...params };
  }

  async writeLogInfo(that?, arguments1?) {
    console.log('ap===>', arguments1);
    const btnOption = arguments1[0];
    const text = btnOption.text;
    if (btnOption.execute[0]['triggerType'] !== 'OPERATION') {
      let componentId;
      if (btnOption.targetViewId) {
        componentId = btnOption.targetViewId;
      } else {
        componentId = that.config.id;
      }

      // ?????? ??????????????????????????????????????????
      let logConfig;
      let btnData;
      btnData = {
        componentId: that.config.id, // ????????????
        targetViewId: componentId, // ??????????????????
        btnId: btnOption.id,
        btnText: btnOption.text,
        description: '[??????]???' + (btnOption.description ? btnOption.description : btnOption.text),
      };

      console.log('????????????', text, '????????????', componentId, btnData);
      if (environment.systemSettings.enableLog) {
        if (environment.systemSettings && environment.systemSettings.logInfo) {
          logConfig = environment.systemSettings.logInfo.logAjaxConfig;
        }
      }
      if (logConfig) {
        const url = logConfig.url;
        const method = logConfig.ajaxType;
        const params = that.buildParameters(logConfig.params, btnData, false);
        const response = await that.componentService.apiService[method](url, params).toPromise();
        console.log('???????????????', response);
      }
    }

    return true;
  }

  public initLog() {
    if (environment.systemSettings.enableLog) {
      this.beforeLog(this, 'rowAction', this.writeLogInfo);
    }
    // this.before(this, 'action', this.writeLogInfo);
  }

  // ???????????????
  private download_xlsx_page(columns?) {
    const col = columns.filter(function (item) {
      // ??????filter??????
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

  // ??????????????????????????????
  private async download_xlsx_all(columns?) {
    if (!this.config.loadingConfig) {
      return;
    }
    const col = columns.filter(function (item) {
      // ??????filter??????
      if (!item.checked) {
      } else {
        return item;
      }
    });
    const data = [col.map((i) => i.title)];
    const url = this.config.loadingConfig.url;
    const method = this.config.loadingConfig.method ? this.config.loadingConfig.method : this.config.loadingConfig.ajaxType;

    const params = {
      ...this.buildParameters(this.config.loadingConfig.params),
      ...this._buildFilter(this.config.loadingConfig.filter),
      ...this._buildSort(),
      // ...this._buildColumnFilter(),
      // ...this._buildFocusId(),
      // ...this._buildSearch()
    };
    const response: any = await this.componentService.apiService.getRequest(url, method, { params }).toPromise();
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
      title: '????????????',
      width: null,
      style: null,
      maskClosable: false,
      cancelText: '??????',
      okText: '??????',
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
      nzContent: components['DownXlsx'],
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
            // ??????????????????
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

  // ??????????????????
  public async executeHttp(url, method, paramData) {
    let dd = new HttpHeaders({ _log: '{"d":"dd"}' });

    console.log('---------?????????-----------', dd);
    return this.componentService.apiService['get'](url, paramData, { headers: dd }).toPromise();
  }

  public buildParameters_More_old(paramsCfg, data?, isArray = false) {
    // ?????? paramsCfg ???????????? ?????????
    /*  */
    let ParamsObj = {
      headParams: [
        // ?????????
      ],
      pathParams: [
        // ????????????
        {
          name: 'pathParam',
          type: 'value',
          value: 'ddd',
        },
      ],
      queryParams: [
        {
          name: 'queryParam',
          type: 'value',
          value: 'ddd',
        },
      ], // ????????????
      bodyParams: [
        {
          name: 'bodyParam',
          type: 'value',
          value: 'ddd',
        },
      ], // ???????????????
      params: [], // ???????????????????????????
    };

    // ???????????????????????????
    let parameterResult: any | any[];
    for (let k in ParamsObj) {
      let s = ParamsObj[k];
      parameterResult[k] = this.buildParameters(paramsCfg, data, isArray);
    }
    return parameterResult;
  }

  public buildAjax_More_old() {
    let backData = {
      headParams: { _token: '{"dd":1}', _log: '{"dd":1}' },
      pathParams: { pathParam1: 'query' },
      queryParams: {},
      bodyParams: {},
      params: {},
    };

    let ajaxConfig = {
      url: 'resource/WMS_RESOURCE_STOCK/update',
      //url: 'resource/GET_MODULE_LIST2/{pathParam1}',
      headParams: [
        // ????????????
        {
          name: '_token',
          type: 'value',
          value: '{"dd":1}',
        },
        {
          name: '_log',
          type: 'value',
          value: '{"componentId":1}',
        },
      ],
      ajaxType: 'put',
      pathParam: [
        // ????????????
        {
          name: 'pathParam',
          type: 'value',
          value: 'query',
        },
      ],
      queryParams: [
        // ????????????
        {
          name: 'queryParam',
          type: 'value',
          value: 'ddd',
        },
      ],
    };

    let ajaxType = ajaxConfig.ajaxType;
    let url = ajaxConfig['url'];
    for (let key in backData['pathParams']) {
      url = url.replace(new RegExp('\\{' + key + '\\}', 'g'), backData['pathParams'][key]);
    }
    //============??????=============
    console.log('???????????????', url);
    //============?????????==========
    // let heads = new HttpHeaders();
    let heads = new HttpHeaders(backData['headParams']);
    // for (let key in backData['headParams']) {
    //   heads.set(key, backData['headParams'][key]);
    // }
    console.log('=?????????==', heads);
    //==========????????????==========
    let queryParam = backData['queryParams'];
    //==========???????????????==========
    let bodyParam = backData['bodyParams'];

    if (ajaxType === 'post' || ajaxType === 'put') {
      return this.componentService.apiService[ajaxType](url, bodyParam, queryParam, { headers: heads }).toPromise();
    }
    if (ajaxType === 'get' || ajaxType === 'delete') {
      return this.componentService.apiService[ajaxType](url, queryParam, { headers: heads }).toPromise();
    }
  }

  public buildParameters_More_bf(paramsCfg, data?, isArray = false) {
    // ?????? paramsCfg ???????????? ?????????

    // ???????????????????????????
    let parameterResult: any = {};
    for (let k in paramsCfg) {
      let paramsCfgItem = paramsCfg[k];
      parameterResult[k] = this.buildParameters(paramsCfgItem, data, isArray);
    }
    return parameterResult;
  }

  public async buildAjax_More_bf(backData?, ajaxConfig?) {
    let ajaxType = ajaxConfig.ajaxType;
    let url = ajaxConfig['url'];
    for (let key in backData['pathParams']) {
      url = url.replace(new RegExp('\\{' + key + '\\}', 'g'), backData['pathParams'][key]);
    }
    //============??????=============
    console.log('???????????????', url);
    //============?????????==========
    // let heads = new HttpHeaders();
    let heads = new HttpHeaders(backData['headParams']);
    // for (let key in backData['headParams']) {
    //   heads.set(key, backData['headParams'][key]);
    // }
    console.log('=?????????==', heads);
    //==========????????????==========
    let queryParam = backData['queryParams'];
    //==========???????????????==========
    let bodyParam = backData['bodyParams'];

    if (ajaxType === 'post' || ajaxType === 'put') {
      return await this.componentService.apiService[ajaxType](url, bodyParam, queryParam, { headers: heads }).toPromise();
    }
    if (ajaxType === 'get' || ajaxType === 'delete') {
      return await this.componentService.apiService[ajaxType](url, queryParam, { headers: heads }).toPromise();
    } else {
      return await this.componentService.apiService[ajaxType](url, bodyParam, queryParam, { headers: heads }).toPromise();
    }
  }

  public ceshi_shuju(data?, result?) {
    data = {
      data: {
        count: 1,
        firstPage: true,
        lastPage: true,
        pageCount: 1,
        pageNum: 1,
        pageSize: 20,
        resultDatas: [{ FIGURE_NUMBER: 'HBb3-0', PRIORITYID: 'lqTenkF1wDKjbc1BXc63gcqU7JfV8UYi' }],
      },
      error: null,
      exception: null,
      success: 1,
      validation: null,
      warn: null,
    };
    let path = '~/:data/:resultDatas/$0/:FIGURE_NUMBER';

    result = {
      name: 'root',
      dataProperties: {
        // ????????????????????????
        dataType: 'object',
      },
      enableGetValue: true,
      getValueConfig: {
        path: '~/:data',
        enableReplace: false, // ????????????????????????
        replace: {
          //1.?????????????????????????????????????????????
          //2.
        }, // ??????????????????????????????????????????
      },
      defalutValue: {}, // ??????????????????????????????
      enableFormart: false,
      formartConfig: {
        // ???????????????
      },
      objectProperties: {
        // ?????????????????????
        setProperties: [
          // ??????????????????????????????????????????????????????
          {
            name: 'ceshiziduan',
            dataProperties: {
              // ????????????????????????
              dataType: 'value',
            },
            enableGetValue: true,
            getValueConfig: {
              path: '~/:data/:resultDatas/$0/:FIGURE_NUMBER',
              enableReplace: false, // ????????????????????????
              replace: {
                //1.?????????????????????????????????????????????
                //2.
              }, // ??????????????????????????????????????????
            },
            defalutValue: null, // ??????????????????????????????
            enableFormart: false,
            formartConfig: {
              // ???????????????
            },
            objectProperties: {
              // ?????????????????????
              setProperties: [
                // ??????????????????????????????????????????????????????
              ], //
              removeProperties: [
                // ???????????????????????????
              ],
            },
            arrayProperties: [
              // ?????????????????????
            ],
          },
        ], //
        removeProperties: [
          // ???????????????????????????
          {
            name: 'firstPage', // ?????????????????????
          },
          {
            name: 'lastPage', // ?????????????????????
          },
        ],
      },
      arrayProperties: [
        // ?????????????????????
      ],
    };

    let dd = this.analysis_Data(data, result);

    console.log('????????????', result);
    console.log('????????????', data);
    console.log('????????????', dd);
    console.log('??????????????????', dd, data, eval('(' + 'null' + ')'), eval('(' + '{}' + ')'));
  }
  public analysis_Data_bf(param_data?, result?) {
    let data = JSON.parse(JSON.stringify(param_data));
    let backInfo: any;

    // ?????????????????????
    if (result['dataProperties']) {
      switch (result['dataProperties']['dataType']) {
        case 'OBJECT':
          // ??????????????? 1
          backInfo = {};
          break;
        case 'ARRAY':
          // ??????????????? 1
          backInfo = [];
          break;
        case 'VALUE':
          // ??????????????? 1
          break;
      }
    }

    // ??????????????????
    if (result['enableGetValue']) {
      if (result.hasOwnProperty('getValueConfig')) {
        // path: '{}root/:shux/$0/[]d',
        backInfo = this.analysis_path(param_data, result['getValueConfig']['path']);
        // ????????????????????????????????????????????????
      }
    } else {
      if (result.hasOwnProperty('defalutValue')) {
        // ???????????????????????????????????????
        // var test = '{ colkey: "col", colsinfo: "NameList" }'
        // var obj2 = eval("(" + test + ")");
        backInfo = result['defalutValue'];
      }
    }

    if (result.hasOwnProperty('objectProperties')) {
      let objectProperties = result['objectProperties'];
      objectProperties['setProperties'].forEach((element) => {
        backInfo[element['name']] = this.analysis_Data(data, element);
      });
      objectProperties['removeProperties'].forEach((element) => {
        if (backInfo && backInfo.hasOwnProperty(element['name'])) {
          delete backInfo[element['name']];
        }
      });
    }

    return backInfo;
  }

  public analysis_path_bf(param_data?, path?) {
    let data = JSON.parse(JSON.stringify(param_data));
    let path_strs: any[]; // ???????????????
    path_strs = path.split('/');
    // ??????????????????

    let _data: any;
    let _isPass = true;
    for (let _index = 0; _index < path_strs.length; _index++) {
      if (!_isPass) {
        break;
      }
      const _indexStr = path_strs[_index];
      if (_indexStr.indexOf('~') > -1) {
        // ???
        _data = data;
      }
      if (_indexStr.indexOf('{}') > -1) {
        // ??????

        const obj_str = _indexStr.split('{}');
        if (obj_str.length < 2) {
          _isPass = false;
        }
        if (_isPass) {
          let object_name = obj_str[1];
          _data = _data[object_name];
        }
      }
      if (_indexStr.indexOf('[]') > -1) {
        // ??????

        const arry_str = _indexStr.split('[]');
        if (arry_str.length < 2) {
          _isPass = false;
        }
        if (_isPass) {
          let arry_name = arry_str[1];
          _data = _data[arry_name];
        }
      }
      if (_indexStr.indexOf(':') > -1) {
        // ??????

        const attr_str = _indexStr.split(':');
        if (attr_str.length < 2) {
          _isPass = false;
        }
        if (_isPass) {
          let attr_name = attr_str[1];
          _data = _data[attr_name];
        }
      }
      if (_indexStr.indexOf('$') > -1) {
        // ??????
        const index_str = _indexStr.split('$');
        if (index_str.length < 2) {
          _isPass = false;
        }
        const _arr_index = parseInt(index_str[1]);
        if (_data && _data.length > _arr_index) {
          _data = _data[_arr_index];
        } else {
          _isPass = false;
        }
      }
      if (_indexStr.indexOf('..') > -1) {
        // ?????????????????????????????????????????????
      }
    }
    console.log('????????????:', param_data, '??????:', path, '???????????????:', _data);

    return _data;
  }

  public async demo() {
    let ajaxConfig = {
      url: 'resource/GET_MODULE_LIST2/{pathParam1}',
      headParams: [
        // ????????????
        {
          name: '_token',
          type: 'value',
          value: '{"dd":1}',
        },
      ],
      ajaxType: 'get',
      pathParams: [
        // ????????????
        {
          name: 'pathParam1',
          type: 'value',
          value: 'query',
        },
      ],
      queryParams: [
        // ????????????
        {
          name: 'PARENT_ID',
          type: 'value',
          value: '8D0D8B0D-94D7-4110-9858-F56263D689AB',
        },
      ],
      bodyParams: [],
      enableResultData: true,
      resultData: {
        enableResultDataMore: true,
        resultDataType: {
          name: 'list_obj',
          title: '??????????????????',
        },
        resultDataMore: {
          name: 'root',
          dataProperties: {
            // ????????????????????????
            dataType: 'object',
          },
          enableGetValue: true,
          getValueConfig: {
            path: '~',
            enableReplace: false, // ????????????????????????
            replace: {
              //1.?????????????????????????????????????????????
              //2.
            }, // ??????????????????????????????????????????
          },
          defalutValue: {}, // ??????????????????????????????
          enableFormart: false,
          formartConfig: {
            // ???????????????
          },
          objectProperties: {
            // ?????????????????????
            setProperties: [
              // ??????????????????????????????????????????????????????

              {
                name: 'data',
                dataProperties: {
                  // ????????????????????????
                  dataType: 'value',
                },
                enableGetValue: true,
                getValueConfig: {
                  path: '~/:data/$0',
                  enableReplace: false, // ????????????????????????
                  replace: {
                    //1.?????????????????????????????????????????????
                    //2.
                  }, // ??????????????????????????????????????????
                },
                defalutValue: null, // ??????????????????????????????
                enableFormart: false,
                formartConfig: {
                  // ???????????????
                },
                objectProperties: {
                  // ?????????????????????
                  setProperties: [
                    // ??????????????????????????????????????????????????????
                  ], //
                  removeProperties: [
                    // ???????????????????????????
                  ],
                },
                arrayProperties: [
                  // ?????????????????????
                ],
              },
            ], //
            removeProperties: [
              // ???????????????????????????
            ],
          },
          arrayProperties: {
            // ?????????????????????
            filterConditions: {
              // ????????????
              dd: ':dd!=2 and or ',
            },
          },
        },
      },
    };
    this.executeHttpMore(ajaxConfig, {});
  }
  // ???ajax ??????
  public async demo1() {
    let ajaxConfig = {
      url: 'resource/GET_MODULE_LIST2/{pathParam1}',
      headParams: [
        // ????????????
        {
          name: '_token',
          type: 'value',
          value: '{"dd":1}',
        },
      ],
      ajaxType: 'get',
      pathParams: [
        // ????????????
        {
          name: 'pathParam1',
          type: 'value',
          value: 'query',
        },
      ],
      queryParams: [
        // ????????????
        {
          name: 'PARENT_ID',
          type: 'value',
          value: '8D0D8B0D-94D7-4110-9858-F56263D689AB',
        },
      ],
      bodyParams: [],
      enableResultData: true,
      resultData: {
        enableResultDataMore: true,
        resultDataType: {
          name: 'list_obj',
          title: '??????????????????',
        },
        resultDataMore: {
          name: 'root',
          dataProperties: {
            // ????????????????????????
            dataType: 'object',
          },
          enableGetValue: true,
          getValueConfig: {
            path: '~',
            enableReplace: false, // ????????????????????????
            replace: {
              //1.?????????????????????????????????????????????
              //2.
            }, // ??????????????????????????????????????????
          },
          defalutValue: {}, // ??????????????????????????????
          enableFormart: false,
          formartConfig: {
            // ???????????????
          },
          objectProperties: {
            // ?????????????????????
            setProperties: [
              // ??????????????????????????????????????????????????????

              {
                name: 'data',
                dataProperties: {
                  // ????????????????????????
                  dataType: 'value',
                },
                enableGetValue: true,
                getValueConfig: {
                  path: '~/:data/$0',
                  enableReplace: false, // ????????????????????????
                  replace: {
                    //1.?????????????????????????????????????????????
                    //2.
                  }, // ??????????????????????????????????????????
                },
                defalutValue: null, // ??????????????????????????????
                enableFormart: false,
                formartConfig: {
                  // ???????????????
                },
                objectProperties: {
                  // ?????????????????????
                  setProperties: [
                    // ??????????????????????????????????????????????????????
                  ], //
                  removeProperties: [
                    // ???????????????????????????
                  ],
                },
                arrayProperties: [
                  // ?????????????????????
                ],
              },
            ], //
            removeProperties: [
              // ???????????????????????????
            ],
          },
          arrayProperties: {
            // ?????????????????????
            filterConditions: {
              // ????????????
              dd: ':dd!=2 and or ',
            },
          },
        },
      },
    };

    const ParamsList = [
      { name: 'headParams' },
      { name: 'pathParams' },
      { name: 'queryParams' },
      { name: 'bodyParams' },
      { name: 'params' },
    ];
    let param_data = {};
    ParamsList.forEach((item) => {
      param_data[item['name']] = ajaxConfig[item['name']] ? ajaxConfig[item['name']] : [];
    });

    // ?????????????????????
    let parameterResult = this.buildParameters_More(param_data, {});

    let _data = await this.buildAjax_More(parameterResult, ajaxConfig);
    let back_data: any;
    if (ajaxConfig['enableResultData']) {
      // ????????????????????????????????????????????????????????????????????????
      back_data = this.analysis_Data(_data, ajaxConfig.resultData.resultDataMore);
    } else {
      back_data = _data;
    }

    console.log('==========================================');
    console.log('$---??????--$:', ajaxConfig);
    console.log('$---??????--$:', back_data);
  }

  /**
   * ????????????????????????
   * @param ajaxConfig
   */
  public async executeHttpMore_liubf(ajaxConfig?, data?) {
    const ParamsList = [
      { name: 'headParams' },
      { name: 'pathParams' },
      { name: 'queryParams' },
      { name: 'bodyParams' },
      { name: 'params' },
    ];
    let param_data = {};
    ParamsList.forEach((item) => {
      param_data[item['name']] = ajaxConfig[item['name']] ? ajaxConfig[item['name']] : [];
    });

    // ?????????????????????
    let parameterResult = this.buildParameters_More(param_data, data);

    let _data = await this.buildAjax_More(parameterResult, ajaxConfig);
    let back_data: any;
    if (ajaxConfig['enableResultData']) {
      // ????????????????????????????????????????????????????????????????????????
      back_data = this.analysis_Data(_data, ajaxConfig.resultData.resultDataMore);
    } else {
      back_data = _data;
    }

    console.log('==========================================');
    console.log('$---??????--$:', ajaxConfig);
    console.log('$---??????--$:', back_data);
  }

  test_WHere() {
    var obj = {};
    var str = "select * from table1 where  b like '%abc%' and ( liu>2 or liu <5 ) and (getData()>'2021' and (d>6)) limit 1000";

    // var str = "select * from table1 where id >1000 and uid=123 or event_id=3 and a in('1',2','3',4) and b like '%abc%' and ( liu>2 and liu <5 ) limit 1000"
    str.match(/\s+from\s+(\w+)/g);
    obj['table'] = RegExp.$1;

    str.match(/\s+limit\s+(\d+)/g);
    obj['limit'] = RegExp.$1;

    str.match(/\s+where\s+(.+)*?\s+limit\s+/g);
    obj['where'] = RegExp.$1;

    var a = obj['where'].split(/\s+(and|or)\s+/);
    console.log('?????????', a);
    var w = '';
    for (var i = 0; i < a.length; i++) {
      if (i % 2 == 1) {
        w += ' ' + a[i] + ' ';
        continue;
      }
      //console.log(a[i]);
      var b = a[i].split(/\s*(>|<|=|>=|<=|\s+in\s*|\s+like\s+)\s*/);
      for (var k in b) {
        b[k] = b[k].trim();
      }
      if (/\s+in\s*/.test(a[i])) {
        var c = b[2].replace(/\(|\)/g, '').split(/,\s*/);
        w += '(';
        for (let k = 0; k < c.length; k++) {
          var d = ' OR ';
          if (k == 0) d = '';
          w += d + "Filter('f1','" + b[0] + "',=,'binary:" + c[k].replace(/'/g, '') + "')";
        }
        w += ')';
      } else if (/\s+like\s+/.test(a[i])) {
        w += "Filter('f1','" + b[0] + "',=,'regexstring:." + b[2].replace(/\%|'/g, '*') + "')";
      } else {
        w += "Filter('f1','" + b[0] + "'," + b[1] + ",'binary:" + b[2] + "')";
      }

      console.log(i, w);
    }
    console.log(w);
  }

  test_filter() {
    let data = [
      {
        name: '??????',
        score: 153,
      },
      {
        name: '??????',
        score: 206,
      },
      {
        name: '??????',
        score: 68.5,
      },
      {
        name: '??????',
        score: 83.5,
      },
    ];
    const filters = [];
    filters.push({
      field: 'name',
      relationType: 'equal',
      value: '??????',
    });
    filters.push({
      field: 'score',
      relationType: 'beginWith',
      value: '6',
    });

    let back = this.filteringDataSources(data, filters);
    console.log('??????????????????', back);
  }
  filteringDataSources(source, filters) {
    // ?????????????????????????????????????????????????????????????????????????????????
    const expressions = [];
    // ???????????????????????????????????????????????????
    filters.forEach((item) => {
      // ????????????????????????????????????????????????????????????
      expressions.push((obj) => {
        // ??????????????????
        let isFit = false;
        // ??????????????????????????????
        let objValue = '';
        // ??????????????????????????????
        const compareValue = item.value;
        // ???????????????????????????????????????????????????????????????????????????????????????????????????
        if (typeof obj[item.field] === 'undefined') {
          isFit = false;
          return isFit;
        }

        // ???????????????????????????????????????????????????????????????????????????????????????
        objValue = String(obj[item.field]);

        // ????????????
        if (item.relationType === 'equal') {
          // ??????
          isFit = objValue === compareValue;
        } else if (item.relationType === 'notEqual') {
          // ?????????
          isFit = objValue !== compareValue;
        } else if (item.relationType === 'like') {
          // ????????????
          isFit = objValue.includes(compareValue);
        } else if (item.relationType === 'beginWith') {
          // ????????????
          isFit = objValue.startsWith(compareValue);
        } else if (item.relationType === 'endWith') {
          // ????????????
          isFit = objValue.endsWith(compareValue);
        }

        // ???????????????????????????????????????
        return isFit;
      });
    });

    // ???????????????
    source = source.filter((item, index) => {
      // ??????????????????
      let isFit = true;
      // ????????????????????????????????????????????????????????????????????????????????????
      for (let index = 0; index < expressions.length; index++) {
        // ?????????????????????
        const expression = expressions[index];
        // ????????????????????????????????????
        const result = expression(item);
        // ???????????????false??????????????????????????????????????????????????????????????????????????????????????????????????????????????????
        if (!result) {
          isFit = false;
          break;
        }
      }

      // ????????????????????????????????????????????????????????????????????????????????????????????????????????????
      return isFit;
    });

    // ???????????????????????????
    return source;
  }

  // ????????????
  formart_More(item) {
    let formart_config = [
      {
        field: 'name',
        relationType: 'equal',
        value: '??????',
        toValue: '',
      },
    ];

    let obj = {};
    // ??????????????????
    let isFit = false;
    // ??????????????????????????????
    let objValue = '';
    // ??????????????????????????????
    const compareValue = item.value;
    // ???????????????????????????????????????????????????????????????????????????????????????????????????
    if (typeof obj[item.field] === 'undefined') {
      isFit = false;
      return isFit;
    }

    // ???????????????????????????????????????????????????????????????????????????????????????
    objValue = String(obj[item.field]);

    // ????????????
    if (item.relationType === 'equal') {
      // ??????
      isFit = objValue === compareValue;
    } else if (item.relationType === 'notEqual') {
      // ?????????
      isFit = objValue !== compareValue;
    } else if (item.relationType === 'like') {
      // ????????????
      isFit = objValue.includes(compareValue);
    } else if (item.relationType === 'beginWith') {
      // ????????????
      isFit = objValue.startsWith(compareValue);
    } else if (item.relationType === 'endWith') {
      // ????????????
      isFit = objValue.endsWith(compareValue);
    }

    // ???????????????????????????????????????
    return isFit;
  }
}
