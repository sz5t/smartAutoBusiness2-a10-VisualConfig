import { CfgLayoutPageComponent } from '../../config-components/config-layout-page/cfg-layout-page/cfg-layout-page.component';
import { Type, Component, OnInit, AfterViewInit, OnDestroy, Inject, Input, Output, EventEmitter } from '@angular/core';
import { CnDataFormComponent } from '../data-form/cn-data-form.component';
import { CnComponentBase } from '../cn-component.base';
import { BSN_COMPONENT_SERVICES } from 'src/app/core/relations/bsn-relatives';
import { ComponentServiceProvider } from 'src/app/core/services/components/component.service';

import { CN_DATA_GRID_METHOD } from 'src/app/core/relations/bsn-methods';
import { CN_DATA_GRID_PROPERTY } from 'src/app/core/relations/bsn-property/data-grid.property.interface';
import { Subject, Subscription } from 'rxjs';
import { RelationResolver } from '../../resolver/relation/relation.resolver';
import { CommonUtils } from 'src/app/core/utils/common-utils';
import { ParameterResolver } from '../../resolver/parameter/parameter.resolver';
import { ButtonOperationResolver } from '../../resolver/buttonOperation/buttonOperation.resolver';
import { BSN_TRIGGER_TYPE } from 'src/app/core/relations/bsn-status';
import { BSN_DATAGRID_TRIGGER } from 'src/app/core/relations/bsn-trigger/data-grid.trigger.interface';

// const component: { [type: string]: Type<any> } = {
//     layout: LayoutResolverComponent,
//     form: CnFormWindowResolverComponent,
//     upload: BsnUploadComponent,
//     importExcel: BsnImportExcelComponent
// };
const components: { [type: string]: Type<any> } = {
  form: CnDataFormComponent,
  cfgLayoutPage: CfgLayoutPageComponent,
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

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'cn-static-table,[cn-static-table]',
  templateUrl: './cn-static-table.component.html',
  styleUrls: [`cn-static-table.component.less`],
})
export class CnStaticTableComponent extends CnComponentBase implements OnInit, AfterViewInit, OnDestroy {
  constructor(
    @Inject(BSN_COMPONENT_SERVICES)
    public componentService: ComponentServiceProvider,
  ) {
    super(componentService);
    this.cacheValue = this.componentService.cacheService;

    // init cacheValue
  }

  @Input()
  public config: any;
  @Input() initData;
  @Input() tempData;
  @Input() changeValue: any;
  @Input()
  public permissions = [];
  @Input()
  public dataList = [];
  @Output() public updateValue = new EventEmitter();
  /**
   * ????????????
   * ???????????????????????????
   */
  public COMPONENT_NAME = 'CnStaticTable';
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

  public readonly = false;

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
  public _dataList = [];

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
  public staticTableSummary = {};

  private _ajaxConfigObj: any = {};

  formCascade = {};

  /**
   * ????????????????????????????????????????????????????????????????????????????????????????????????????????????
   * ????????????????????????????????????????????????????????????????????????
   * ??????????????????
   */

  rowConfig = [
    {
      colName: 'tel',
      groupName: 'groupid', // ????????????
      groupOrder: 1, //  ?????????????????????????????????????????? ???
      showValue: '', // ????????????????????????  ?????????????????? ???????????????????????????
      groupCols: [
        // ????????????????????? ??????????????????
        {
          groupColName: 'groupid', // ????????????
        },
      ],
    },
  ];

  colConfig = [
    {
      colName: 'tel',
      // ???????????????????????? ?????? ??????= 1
      mergeItems: [
        // ??????????????????????????????
        {
          type: 'condition', //    -- ????????????????????????, ??????default ???condition????????????????????????
          caseValue: {
            // -- ????????????????????????
            type: 'rowValue', // --??????????????????
            valueName: 'id', // --??????????????????
            regular: '^003$',
            value: '',
          },
          condition: [], // ??????
          mergeCols: [
            {
              mergeColName: 'tel', // ????????????
            },
            {
              mergeColName: 'phone', // ????????????
            },
          ],
        },
      ],
    },
  ];

  listOfData = [
    {
      id: '001',
      name: '001',
      age: '18',
      tel: '3kg',
      phone: '1.6kg',
      groupid: '001',
      groupNum: 2,
      groupIndex: 1, // ??????????????????
      colgroupIndex: 1,
      colgroupNum: 1,
    },
    {
      id: '002',
      name: '002',
      age: '20',
      tel: '3333',
      phone: '1.4kg',
      groupid: '001',
      groupNum: 2,
      groupIndex: 2, // ??????????????????
      colgroupIndex: 1,
      colgroupNum: 1,
    },
    {
      id: '003',
      name: '003',
      age: '20',
      tel: '5kg',
      phone: '187000',
      groupid: '002',
      groupNum: 1,
      groupIndex: 1, // ??????????????????
      colgroupIndex: 1,
      colgroupNum: 2,
    },
    {
      id: '004',
      name: '004',
      age: '20',
      tel: '2kg',
      phone: '1kg',
      groupid: '003',
      groupNum: 1,
      groupIndex: 1, // ??????????????????
      colgroupIndex: 1,
      colgroupNum: 1,
    },
  ];

  // groupIndex ????????????????????????groupNum ????????????????????????????????????????????????????????? ????????????????????????
  mapd = {
    '001': {
      id: {},
      tel: {
        groupNum: 2,
        groupIndex: 1, // ??????????????????
        colgroupIndex: 1,
        colgroupNum: 1,
      },
      phone: {
        groupNum: 1,
        groupIndex: 1, // ??????????????????
        colgroupIndex: 1,
        colgroupNum: 1,
      },
    },
    '002': {
      id: {},
      tel: {
        groupNum: 2,
        groupIndex: 2, // ??????????????????
        colgroupIndex: 1,
        colgroupNum: 1,
      },
      phone: {
        groupNum: 1,
        groupIndex: 1, // ??????????????????
        colgroupIndex: 1,
        colgroupNum: 1,
      },
    },
    '003': {
      id: {},
      tel: {
        groupNum: 1,
        groupIndex: 1, // ??????????????????
        colgroupIndex: 1,
        colgroupNum: 2,
      },
      phone: {
        groupNum: 1,
        groupIndex: 1, // ??????????????????
        colgroupIndex: 2,
        colgroupNum: 1,
      },
    },
    '004': {
      id: {},
      tel: {
        groupNum: 1,
        groupIndex: 1, // ??????????????????
        colgroupIndex: 1,
        colgroupNum: 1,
      },
      phone: {
        groupNum: 1,
        groupIndex: 1, // ??????????????????
        colgroupIndex: 1,
        colgroupNum: 1,
      },
    },
  };

  mapd1 = {
    '001': {
      id: {},
      tel: {
        groupNum: 1,
        groupIndex: 1, // ??????????????????
        colgroupIndex: 1,
        colgroupNum: 1,
      },
      phone: {
        groupNum: 1,
        groupIndex: 1, // ??????????????????
        colgroupIndex: 1,
        colgroupNum: 1,
      },
    },
    '002': {
      id: {},
      tel: {
        groupNum: 1,
        groupIndex: 1, // ??????????????????
        colgroupIndex: 1,
        colgroupNum: 1,
      },
      phone: {
        groupNum: 1,
        groupIndex: 1, // ??????????????????
        colgroupIndex: 1,
        colgroupNum: 1,
      },
    },
    '003': {
      id: {},
      tel: {
        groupNum: 1,
        groupIndex: 1, // ??????????????????
        colgroupIndex: 1,
        colgroupNum: 1,
      },
      phone: {
        groupNum: 1,
        groupIndex: 1, // ??????????????????
        colgroupIndex: 1,
        colgroupNum: 1,
      },
    },
    '004': {
      id: {},
      tel: {
        groupNum: 1,
        groupIndex: 1, // ??????????????????
        colgroupIndex: 1,
        colgroupNum: 1,
      },
      phone: {
        groupNum: 1,
        groupIndex: 1, // ??????????????????
        colgroupIndex: 1,
        colgroupNum: 1,
      },
    },
  };

  listOfData2 = [
    {
      id: '001',
      companyname: '??????1',
      type: 'a',
      shopname: 'mes',
      price: '12',
    },
    {
      id: '002',
      companyname: '??????',
      type: 'a',
      shopname: 'Imes',
      price: '13',
    },
    {
      id: '003',
      companyname: '??????',
      type: 'b',
      shopname: 'mes',
      price: '22',
    },
    {
      id: '004',
      companyname: '??????',
      type: 'b',
      shopname: 'Imes',
      price: '42',
    },
    {
      id: '005',
      companyname: '??????',
      type: 'a',
      shopname: 'mes',
      price: '17',
    },
    {
      id: '006',
      companyname: '??????',
      type: 'a',
      shopname: 'Imes',
      price: '18',
    },
    {
      id: '007',
      companyname: '??????',
      type: 'b',
      shopname: 'mes',
      price: '19',
    },
    {
      id: '008',
      companyname: '??????',
      type: 'b',
      shopname: 'Imes',
      price: '21',
    },
  ];

  mergeconfig = {
    rowConfig: [
      {
        colName: 'companyname',
        isEdit: '', // ??????????????????????????????????????????????????????????????????????????????   ????????????????????????
        groupName: 'companyname', // ????????????
        groupOrder: 1, //  ?????????????????????????????????????????? ???
        showValue: '', // ????????????????????????  ?????????????????? ???????????????????????????
        groupCols: [
          // ????????????????????? ??????????????????
          {
            groupColName: 'companyname', // ????????????
          },
        ],
      },
      {
        colName: 'type',
        groupName: 'type', // ????????????
        groupOrder: 1, //  ?????????????????????????????????????????? ???
        showValue: '', // ????????????????????????  ?????????????????? ???????????????????????????
        groupCols: [
          // ????????????????????? ??????????????????
          {
            groupColName: 'companyname', // ????????????
          },
          {
            groupColName: 'type', // ????????????
          },
        ],
      },
    ],
  };

  //  ??????????????????????????????
  // ??????????????????????????????????????????  ???????????????????????????????????????????????? ????????????fitter

  // ????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????

  mergetableEditor = {
    id: {
      // ????????????????????????  ????????????????????????????????? ??????????????????
    },
  };

  mergetableColumns = [
    {
      field: 'id',
      title: '??????',
    },
    {
      field: 'companyname',
      title: '????????????',
    },
    {
      field: 'type',
      title: '??????',
    },
    {
      field: 'shopname',
      title: '??????',
    },
    {
      field: 'price',
      title: '??????',
    },
  ];

  mergeData = {};
  mergeData1 = {
    '001': {},
    '002': {},
    '003': {},
    '004': {},
    '005': {},
    '006': {},
    '007': {},
    '008': {},
  };

  public ngOnInit() {
    console.log('-----------stattic_table------------', this.config);
    this.setChangeValue(this.changeValue);
    // ????????????????????????
    this.KEY_ID = this.config.keyId ? this.config.keyId : 'id';

    // ???????????????????????????
    this.config.pageSize && (this.pageSize = this.config.pageSize);

    this.config.ajaxConfig.forEach((ajax) => {
      this._ajaxConfigObj[ajax.id] = ajax;
    });

    // ???????????????????????????
    this._buildColumns(this.config.columns);

    this._initInnerValue();

    // ??????????????????
    this.resolveRelations();

    // ???????????????????????????????????????
    if (this.config.loadingOnInit) {
      this.load();
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

  public ngAfterViewInit() { }

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
            const act = this.config.rowActions.find((action) => actionId === action.id);
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

  public addBtnClick(event?) {
    console.log('addBtnClick', event);
    if (event) {
      if (event.code === 'Enter') {
        return false;
      }
    }
    this.addRow();
    this.updateValue.emit(this.getAddedNewRowsData());
  }

  public getAddedNewRowsData(): any {
    //  return this.ROWS_ADDED;
    return [...this.ROWS_ADDED, ...this.ROWS_EDITED];
  }

  public loadStaticData(data) {
    this._initComponentData();
    let _index = 0;
    if (this.pageIndex === 1) {
      _index = _index;
    } else {
      _index = (this.pageIndex - 1) * this.pageSize;
    }
    if (data && Array.isArray(data) && data.length > 0) {
      data.map((d, index) => {
        _index = _index + 1;
        d._index = _index;
        if (d.$state$ === 'insert') {
          this.mapOfDataState[d[this.KEY_ID]] = {
            disabled: false,
            checked: false, // index === 0 ? true : false,
            selected: false, // index === 0 ? true : false,
            state: 'new',
            data: d,
            originData: { ...d },
            validation: true,
            actions: this.getRowActions('new'),
            mergeData: {},
          };
        } else if (d.$state$ === 'text') {
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
          };
        } else {
          d.$state$ = 'update';
          this.mapOfDataState[d[this.KEY_ID]] = {
            disabled: false,
            checked: false, // index === 0 ? true : false,
            selected: false, // index === 0 ? true : false,
            state: 'edit',
            data: d,
            originData: { ...d },
            validation: true,
            actions: this.getRowActions('edit'),
            mergeData: {},
          };
        }

        if (!this.config.isSelected) {
          index === 0 && (this.ROW_SELECTED = d);
        } else {
          if (d[this.KEY_ID] === this.selectedRowValue) {
            this.ROW_SELECTED = d;
          }
        }

        // formCascade
        this.formCascade[d[this.KEY_ID]] = {};

        for (const v in d) {
          if (d.hasOwnProperty(v)) {
            const rItem = { id: d[this.KEY_ID], name: v, value: d[v] };
            this.columnSummary(rItem);
          }
        }
      });
      setTimeout(() => {
        this._dataList = data;
        this.dataList = this._dataList.filter((item) => item.state !== 'delete');
      });
      this.ROWS_EDITED = [...data];
      this.total = data.length;

      // ??????
      // this.dataCheckedStatusChange();
      // ???????????????????????????, ??????????????????????????????????????????,?????????setSelectRow???????????????
      // this.dataList.length > 0 && this.setSelectRow(this.ROW_SELECTED);

      this.setSelectRow(this.ROW_SELECTED);
      this.isLoading = false;
    }
    this.dataList = data;
    this.L_columnSummary();
    // console.log('???????????????',this.tempValue,this.dataList);
  }

  // #region state Liu ?????????????????????
  //  liu ?????????????????????
  //  ??????????????????
  //  ???????????????????????????????????? locateRow
  //  ????????????????????? ??????????????????????????????????????????????????????????????????????????????????????????
  // liu ????????????
  public scanCodeLoad() {
    // const index = this.dataList.findIndex(item => item[code] === codeValue);
    const index = this.dataList.length - 1;
    if (index !== -1) {
      // const rowValue = this.loadData.rows[index]['key'];
      this.pageIndex = Math.ceil((index + 1) / this.pageSize);
      //  this.load();
      //  this.scanCodeSetSelectRow(rowValue);
      // ???????????????????????????????????????
    } else {
      console.log('????????????????????????????????????');
    }
  }

  // ???????????????????????????
  public custom_exist(option?, structureConfig?) {
    const newconfig = {
      custom: [
        // ??????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????
        {
          id: '001',
          name: 'addRow',
          content: [
            // ????????????????????????????????????
            {
              type: '???????????????',
              children: [
                {
                  type: 'exec',
                  content: [],
                },
              ],
            },
          ],
          addRow: {
            // ????????????
          },
        },
      ],
    };

    let addRowMapping;

    let row_data = {};
    if (structureConfig && structureConfig.hasOwnProperty('structure') && structureConfig.structure) {
      addRowMapping = structureConfig.structure;
    }

    if (addRowMapping) {
      addRowMapping.forEach((add_row) => {
        let value;
        if (add_row.type === 'tempValue') {
          value = this.tempValue[add_row.valueName];
        } else if (add_row.type === 'tempValue') {
          value = this.initValue[add_row.valueName];
        } else if (add_row.type === 'value') {
          value = add_row.value;
        } else if (add_row.type === 'item') {
          value = option[add_row.valueName];
        }
        row_data[add_row.name] = value;
      });
    } else {
      row_data = {};
    }

    const back_dataList = this.dataList.filter((item) => {
      let back = true;
      for (const key in row_data) {
        // console.log(key + '---' + row_data[key]);
        if (row_data[key] !== item[key]) {
          back = false;
        }
      }
      return back;
    });

    if (back_dataList && back_dataList.length > 0) {
      // return true;
      return { result: true, data: back_dataList[0] };
    } else {
      // return false;
      return { result: false, data: null };
    }
  }

  // ?????????????????????????????????????????????????????????

  /**
   * ????????? , ?????????????????????????????????????????????????????????????????????????????????????????????
   */
  public scanCode_locateRow() {
    // ??????????????????????????????????????????????????????
    // ????????????  A > B  ???????????? ?????????  regular  rule
    const rule = {
      condition: [
        {
          type: 'symbol',
          valueName: '>', // ????????????  && ???||???  >??? <??? >=??? <=???  ===???  !==???  isnull    /
          children: [
            {
              type: 'value',
              valueName: 'A',
            },
            {
              type: 'value',
              valueName: 'B',
            },
          ],
        },
      ],
      data: {
        // ??????????????????
        option: [
          {
            name: 'A',
            type: 'rowValue', // ???????????? ??????????????? rowValue ????????????????????????????????????????????????
            valueName: 'name',
          },
          {
            name: 'B',
            type: 'rowValue', // ???????????? ??????????????? rowValue
            valueName: 'name',
          },
        ],
      },
    };

    // ??????????????????????????????????????????

    // ??????????????????????????????
    this.setSelectRow(this.ROW_SELECTED);
  }

  public custom_add(option?, structureConfig?) {
    let addRowMapping;

    let row_data = {};
    if (structureConfig && structureConfig.hasOwnProperty('structure') && structureConfig.structure) {
      addRowMapping = structureConfig.structure;
    }

    if (addRowMapping) {
      addRowMapping.forEach((add_row) => {
        let value;
        if (add_row.type === 'tempValue') {
          value = this.tempValue[add_row.valueName];
        } else if (add_row.type === 'tempValue') {
          value = this.initValue[add_row.valueName];
        } else if (add_row.type === 'value') {
          value = add_row.value;
        } else if (add_row.type === 'item') {
          value = option[add_row.valueName];
        }
        row_data[add_row.name] = value;
      });
    } else {
      row_data = option;
    }

    // ?????????????????????????????????????????????,?????????????????????

    // ?????????????????????
    let newId = CommonUtils.uuID(36);

    // ??????????????????
    if (row_data[this.KEY_ID]) {
      newId = row_data[this.KEY_ID];
    }
    let newData = this.createNewRowData();
    newData[this.KEY_ID] = newId;
    // ????????????
    newData = { ...newData, ...row_data };

    // ??????????????????????????????,???????????????????????????????????????
    this.dataList = [...this.dataList, newData];
    this.total = this.dataList.length;

    // ??????????????????
    this.mapOfDataState[newId] = {
      data: newData,
      originData: { ...newData },
      disabled: false,
      checked: true, // index === 0 ? true : false,
      selected: false, // index === 0 ? true : false,
      state: 'new',
      actions: this.getRowActions('new'),
      validation: true,
      mergeData: {},
    };

    // formCascade
    setTimeout(() => {
      this.formCascade[newId] = {};
    });

    this.ROWS_ADDED = [newData, ...this.ROWS_ADDED];
    this.scanCodeLoad();
    this.L_columnSummary();
    this.updateValue_dataList('custom_add'); // ???????????????
    // return true;

    return { result: true, data: newData };

    console.log('+++++++++++?????????????????????+++++++++++', this.dataList, this.mapOfDataState);
    // ????????????
  }
  public custom_update(option?, structureConfig?, backData?) {
    let addRowMapping;

    let row_data = {};
    if (structureConfig && structureConfig.hasOwnProperty('structure') && structureConfig.structure) {
      addRowMapping = structureConfig.structure;
    }

    if (addRowMapping) {
      addRowMapping.forEach((add_row) => {
        let value;
        if (add_row.type === 'tempValue') {
          value = this.tempValue[add_row.valueName];
        } else if (add_row.type === 'tempValue') {
          value = this.initValue[add_row.valueName];
        } else if (add_row.type === 'value') {
          value = add_row.value;
        } else if (add_row.type === 'item') {
          value = option[add_row.valueName];
        }
        row_data[add_row.name] = value;
      });
    } else {
      row_data = option;
    }

    // ?????????????????????????????????????????????,?????????????????????

    // ?????????????????????
    let newId = CommonUtils.uuID(36);
    let newData = {};

    if (backData && addRowMapping) {
      newId = backData[this.KEY_ID];

      addRowMapping.forEach((add_row) => {
        let value;
        if (add_row.type === 'tempValue') {
          value = this.tempValue[add_row.valueName];
        } else if (add_row.type === 'tempValue') {
          value = this.initValue[add_row.valueName];
        } else if (add_row.type === 'value') {
          value = add_row.value;
        } else if (add_row.type === 'item') {
          value = option[add_row.valueName];
        }

        // "symbol":"plus", // plus\reduce\ride\except\cover ????????????
        if (add_row.symbol === 'plus') {
          this.mapOfDataState[newId].data[add_row.name] = parseFloat((this.mapOfDataState[newId].data[add_row.name] + value).toFixed(10));
          // this.mapOfDataState[newId]['originData'][add_row['name']] = parseFloat(( this.mapOfDataState[newId]['data'][add_row['name']] + value).toFixed(10));
          // this.mapOfDataState[newId]['data'][add_row['name']] + value;
          if (!this.formCascade[newId][add_row.name]) {
            this.formCascade[newId][add_row.name] = {};
          }
          //  this.formCascade[newId][add_row['name']]['setValue'] = { value:  this.mapOfDataState[newId]['data'][add_row['name']] };
          //  this.formCascade[newId][add_row['name']]['exec']= 'setValue';
          //  this.formCascade[newId][add_row['name']] = JSON.parse(JSON.stringify(this.formCascade[newId][add_row['name']]));
        }
        if (add_row.symbol === 'reduce') {
          this.mapOfDataState[newId].data[add_row.name] = this.mapOfDataState[newId].data[add_row.name] - value;
        }
        if (add_row.symbol === 'cover') {
          this.mapOfDataState[newId].data[add_row.name] = value;
        }
      });

      if (newId) {
        if (!this.formCascade[newId]) {
          this.formCascade[newId] = {};
        }
      }
      newData = this.mapOfDataState[newId].data;
      // const dd = JSON.parse(JSON.stringify(this.dataList));

      const new_index = this.dataList.findIndex((item) => item[this.KEY_ID] === newData[this.KEY_ID]);
      if (new_index > -1) {
        this.dataList[new_index] = newData;
      }
      this.dataList = JSON.parse(JSON.stringify(this.dataList));
      this.L_columnSummary();
      // this.dataList = this.dataList.filter(d => d[this.KEY_ID] !== '');
      // setTimeout(() => {
      //     this.dataList = dd;
      // });

      console.log('+++++++++++?????????????????????+++++++++++', this.dataList, this.mapOfDataState);

      return { result: true, data: newData };
    } else {
      return { result: false, data: newData };
    }

    // return true;

    console.log('+++++++++++?????????????????????+++++++++++', this.dataList, this.mapOfDataState);
    // ????????????
  }

  // ????????????????????????
  public component_customAction(option?) {
    const customAction_Id = option.customActionId;
    const customAction_data = option;

    let _customAction_list;
    _customAction_list = this.config.customAction.filter((item) => item.id === customAction_Id);
    if (_customAction_list && _customAction_list.length > 0) {
      const _customAction = _customAction_list[0];
      this.execute_component_customAction(_customAction, _customAction.defineStructure, customAction_data);
    }

    return true;
  }

  public execute_component_customAction(customAction?, defineStructure?, data?, backData?) {
    console.log('execute_component_customAction', customAction, data);
    customAction.execute.forEach((item) => {
      if (item.type === 'relation') {
        new RelationResolver(this).resolveInnerSender(item.sender, {}, Array.isArray({}));
      } else if (item.type === 'action') {
        let result = false;
        let resultObj;
        let resultData;
        const actionType = item.content.actionType;
        const structureId = item.content.structureId;
        let structure;
        if (structureId && defineStructure && defineStructure.length > 0) {
          const structureList = defineStructure.filter((structureItem) => structureItem.id === structureId);
          if (structureList && structureList.length > 0) {
            structure = structureList[0];
          }
        }
        switch (actionType) {
          case 'custom_exist':
            resultObj = this.custom_exist(data, structure);
            break;
          case 'custom_add':
            resultObj = this.custom_add(data, structure);
            break;
          case 'custom_locate':
            break;
          case 'custom_update':
            resultObj = this.custom_update(data, structure, backData);
            break;
        }

        if (resultObj) {
          result = resultObj.result;
          resultData = resultObj.data;
        }

        if (item.result) {
          let resultAction;
          let resultActionList;

          if (result) {
            resultActionList = item.result.filter((resultItem) => resultItem.resultName === 'success');
          } else {
            resultActionList = item.result.filter((resultItem) => resultItem.resultName === 'failed');
          }
          if (resultActionList && resultActionList.length > 0) {
            resultAction = resultActionList[0];
            this.execute_component_customAction(resultAction, defineStructure, data, resultData);
          }
        }
      }
    });

    return true;
  }

  // #endregion

  public load() {
    this.isLoading = true;
    const url = this.config.loadingConfig.url;
    const method = this.config.loadingConfig.method;
    const params = {
      ...this.buildParameters(this.config.loadingConfig.params),
      ...this._buildPaging(),
      // ...this._buildFilter(this.config.ajaxConfig.filter),
      ...this._buildSort(),
      // ...this._buildColumnFilter(),
      // ...this._buildFocusId(),
      // ...this._buildSearch()
    };

    this.componentService.apiService.getRequest(url, method, { params }).subscribe(
      (response) => {
        if (response && response.data && response.data.resultDatas) {
          this._initComponentData();
          response.data.resultDatas.map((d, index) => {
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

  public loadRefreshData(Option) {
    this.isLoading = true;
    const url = this.config.loadingConfig.url;
    const method = this.config.loadingConfig.method;
    // ??????????????????id??????,??????ids
    const param1: any = {};
    if (Option && Array.isArray(Option)) {
      const rids = [];
      Option.map((opt) => {
        rids.push(opt[this.KEY_ID]);
      });
      param1.id = `in(${rids.join(',')})`;
    } else if (Option) {
      param1.id = `in(${Option[this.KEY_ID]})`;
    }

    // ??????????????????
    const params = {
      ...this.buildParameters(this.config.loadingConfig.params),
      // ...this._buildPaging(),
      ...param1,
    };

    this.componentService.apiService.getRequest(url, method, { params }).subscribe(
      (response) => {
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
      sortObj._sort = this._sortName + this._sortValue;
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
    // ??????????????????,?????????????????????????????? new;
    const newData = { $state$: 'insert' };
    this.config.columns
      .filter((c) => c.type !== 'action')
      .map((col) => {
        if (col.type === 'index') {
          newData[col.field] = this.dataList.length + 1;
        } else {
          newData[col.field] = null;
        }
      });
    return newData;
  }

  public addRow() {
    // ?????????????????????
    const newId = CommonUtils.uuID(36);
    const newData = this.createNewRowData();
    newData[this.KEY_ID] = newId;

    // ??????????????????????????????,???????????????????????????????????????
    this.dataList = [...this.dataList, newData];
    this.total = this.dataList.length;

    // ??????????????????
    this.mapOfDataState[newId] = {
      data: newData,
      originData: { ...newData },
      disabled: false,
      checked: true, // index === 0 ? true : false,
      selected: false, // index === 0 ? true : false,
      state: 'new',
      actions: this.getRowActions('new'),
      validation: true,
      mergeData: {},
    };

    // formCascade
    setTimeout(() => {
      this.formCascade[newId] = {};
    });

    this.ROWS_ADDED = [newData, ...this.ROWS_ADDED];
    this.scanCodeLoad();

    console.log('+++++++++++?????????????????????+++++++++++', this.dataList, this.mapOfDataState);
    // ????????????
  }

  private removeEditRow(item) {
    this.dataList.find((d) => d[this.KEY_ID] === item[this.KEY_ID]).$state$ = 'delete';
    const rItem: any = this.ROWS_EDITED.find((r) => r[this.KEY_ID] === item[this.KEY_ID]);
    if (rItem) {
      rItem.data.$state$ = 'delete';
      rItem.state = 'delete';
    }
    // this.dataList = this.dataList.filter(r => r[this.KEY_ID] !== item[this.KEY_ID]);
    // this.ROWS_EDITED = this.ROWS_EDITED.filter(r => r[this.KEY_ID] !== item[this.KEY_ID]);
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
    if (option.data) {
      this.addEditRows(option.data.data);
    }
    return true;
  }

  // ????????????????????? ??????
  public cancelNewRow(option) {
    if (option.data) {
      this.removeNewRow(option.data.data);
    }
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
    return true;
  }

  private removeNewRow(item) {
    this.dataList = this.dataList.filter((r) => r[this.KEY_ID] !== item[this.KEY_ID]);
    this.ROWS_ADDED = this.ROWS_ADDED.filter((r) => r[this.KEY_ID] !== item[this.KEY_ID]);
    delete this.mapOfDataState[item[this.KEY_ID]];

    for (const v in item) {
      if (item.hasOwnProperty(v)) {
        const rItem = { id: item[this.KEY_ID], name: v, value: item[v] };
        this.columnSummary(rItem);
      }
    }

    // 200512 ????????????????????????
    //
    if (this.mapOfDataState.hasOwnProperty(item[this.KEY_ID])) {
      delete this.mapOfDataState[item[this.KEY_ID]];
    }

    this.total = this.dataList.length;
    this.L_columnSummary();
    this.updateValue_dataList('removeNewRow');
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
        // this.ROWS_EDITED = this.ROWS_EDITED.filter(r => r[this.KEY_ID] !== itemId);

        // // ????????????,???????????????,????????????????????????
        // this.dataList = this.dataList.filter(r => r[this.KEY_ID] !== itemId);

        const dl = this.dataList.find((d) => d[this.KEY_ID] === itemId);
        if (dl) {
          dl.$state$ = 'delete';
        }
        const rItem: any = this.ROWS_EDITED.find((r) => r[this.KEY_ID] === itemId);
        if (rItem) {
          rItem.$state$ = 'delete';
          // rItem['state'] = "delete";
        }

        // liu 200512 ????????????
        this.dataList = this.dataList.filter((r) => r[this.KEY_ID] !== itemId);
        this.total = this.dataList.length;
      }
    }

    this.L_columnSummary();
    this.updateValue_dataList('cancelEditRow');
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
          this.mapOfDataState[opt[this.KEY_ID]].actions = [...this.config.rowActions.filter((action) => action.state === 'text')];
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
      this.mapOfDataState[option[this.KEY_ID]].actions = [...this.config.rowActions.filter((action) => action.state === 'text')];
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

  public async executeHttpRequest(url, method, paramData) {
    return this.componentService.apiService[method](url, paramData).toPromise();
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
  }

  public async deleteCurrentRow(option) {
    console.log(this.config.id + '-------------executeSelectRow', option);

    // const url = option.ajaxConfig.url;
    // const method = option.ajaxConfig.ajaxType ? option.ajaxConfig.ajaxType : 'delete';
    // const ajaxParams = option.ajaxConfig.params ? option.ajaxConfig.params : []
    // let paramData;
    // if (option.data) {
    //     paramData = ParameterResolver.resolve({
    //         params: ajaxParams,
    //         item: option.data.data,
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

  public async executeCurrentRow(option) {
    const url = option.ajaxConfig.url;
    const method = option.ajaxConfig.ajaxType;
    const ajaxParams = option.ajaxConfig.params ? option.ajaxConfig.params : [];
    let paramData;
    if (option.data) {
      paramData = ParameterResolver.resolve({
        params: ajaxParams,
        item: option.data.data,
        tempValue: this.tempValue,
        initValue: this.initValue,
        cacheValue: this.cacheValue,
        userValue: this.userValue,
      });
    }
    const response = await this.executeHttpRequest(url, method, paramData);
    // ??????????????????,??????????????????????????????????????????,???????????????????????????????????? {}
    this._sendDataSuccessMessage(response, option.ajaxConfig.result);

    // ??????validation??????
    const validationResult = this._sendDataValidationMessage(response, option.ajaxConfig.result);

    // ??????error??????
    const errorResult = this._sendDataErrorMessage(response, option.ajaxConfig.result);

    return validationResult && errorResult;
  }

  private _sendDataSuccessMessage(response, resultCfg): boolean {
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

  public async saveRow(option) {
    const ajaxConfig = option.ajaxConfig;
    const rowData = option.data.data;
    const url = ajaxConfig.url;
    const paramData = ParameterResolver.resolve({
      params: ajaxConfig.params,
      tempValue: this.tempValue,
      componentValue: rowData,
      item: this.ROW_SELECTED,
      initValue: this.initValue,
      cacheValue: this.cacheValue,
      router: this.routerValue,
      userValue: this.userValue,
    });

    const response = await this.componentService.apiService[ajaxConfig.ajaxType](url, paramData).toPromise();

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
   */
  public async saveRows(option) {
    const ajaxConfig = option.ajaxConfig;
    // ??????????????????
    // ??????????????????
    const url = ajaxConfig.url;
    this.COMPONENT_VALUE = this._getComponentValueByHttpMethod(ajaxConfig.ajaxType);
    const paramsData = this.buildParameters(ajaxConfig.params, this.COMPONENT_VALUE, true);
    const response = await this.componentService.apiService[ajaxConfig.ajaxType](url, paramsData).toPromise();
    // ??????????????????,??????????????????????????????????????????,???????????????????????????????????? {}
    this._sendDataSuccessMessage(response, ajaxConfig.result);

    // ??????validation??????
    const validationResult = this._sendDataValidationMessage(response, ajaxConfig.result);

    // ??????error??????
    const errorResult = this._sendDataErrorMessage(response, ajaxConfig.result);

    // ??????true????????????????????????, ??????false????????????,??????????????????????????????????????????
    return validationResult && errorResult;
  }

  public setSelectRow(rowData?, $event?) {
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

    this.ROW_SELECTED = rowData;

    // ???????????????
    if (this.dataList.length > 0) {
      this.dataList.map((row) => {
        this.mapOfDataState[row[this.KEY_ID]].selected = false;
      });

      if (rowData[this.KEY_ID] && rowData[this.KEY_ID].length > 0) {
        this.mapOfDataState[rowData[this.KEY_ID]].selected = true;
      }

      // ??????/???????????????????????????
      this.mapOfDataState[rowData[this.KEY_ID]].checked = !this.mapOfDataState[rowData[this.KEY_ID]].checked;
      this.dataCheckedStatusChange();
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
        const mapData = this.mapOfDataState[newData[this.KEY_ID]];
        if (mapData) {
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
            state: 'new',
            actions: this.getRowActions('new'),
          };
        }
      });
    }
    // ??????dataList
    // ??????mapOfDataState
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
        currentRow: this.ROW_CURRENT,
        userValue: this.userValue,
      });
    } else if (!isArray && data) {
      parameterResult = ParameterResolver.resolve({
        params: paramsCfg,
        tempValue: this.tempValue,
        componentValue: this.COMPONENT_VALUE,
        item: this.ROW_SELECTED,
        initValue: this.initValue,
        cacheValue: this.cacheValue,
        router: this.routerValue,
        addedRows: data,
        editedRows: data,
        validation: data,
        returnValue: data,
        currentRow: this.ROW_CURRENT,
        userValue: this.userValue,
      });
    } else if (isArray && data && Array.isArray(data)) {
      parameterResult = [];
      data.map((d) => {
        const param = ParameterResolver.resolve({
          params: paramsCfg,
          tempValue: this.tempValue,
          componentValue: d,
          item: this.ROW_SELECTED,
          initValue: this.initValue,
          cacheValue: this.cacheValue,
          router: this.routerValue,
          addedRows: d,
          editedRows: d,
          validation: d,
          returnValue: d,
          currentRow: this.ROW_CURRENT,
          userValue: this.userValue,
        });
        parameterResult.push(param);
      });
    }
    return parameterResult;
  }

  public getCurrentComponentId() {
    return this.config.id;
  }

  public async executeSelectRow(option) {
    console.log(this.config.id + '-------------executeSelectRow', option);
    const ajaxParams = option.ajaxConfig.params ? option.ajaxConfig.params : [];
    const paramData = this._createSelectedRowParameter(ajaxParams);
    const result = await this._executeAjax(option, paramData);
    return result;
  }

  private async _executeAjax(option, paramData) {
    const url = option.ajaxConfig.url;
    const method = option.ajaxConfig.ajaxType;

    const response = await this.executeHttpRequest(url, method, paramData ? paramData : {});
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
      userValue: this.userValue,
    });
  }

  public executeCheckedRows() {
    console.log(this.config.id + '-------------executeCheckedRows');
  }

  public async executeCheckedRowsIds(option) {
    console.log(this.config.id + '-------------executeCheckedRowsIds', option);
    const ajaxParams = option.ajaxConfig.params ? option.ajaxConfig.params : [];
    const paramData = this._createCheckedRowsIdParameter(ajaxParams);
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

  public export() { }

  public import() { }

  public download() { }

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
      this.executeCheckedRows();
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
    if (option.changeValue) {
      const d = ParameterResolver.resolve({
        params: option.changeValue.params,
        tempValue: this.tempValue,
        // componentValue: cmptValue,
        item: this.ROW_SELECTED,
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

  public showWindow() { }

  public showUpload() { }

  public showBatchDialog() { }

  /**
   * ???????????????
   */
  public showMessage(option) {
    const message: { type: string; message: string; field: string } = { type: '', message: '', field: '' };
    if (option && Array.isArray(option)) {
      message.message = option[0].code;
      message.type = option[0].type;
      message.field = option[0].field;
    } else if (option) {
      message.message = option.code ? option.code : '';
      message.type = option.type;
      message.field = option.field ? option.field : '';
    }

    option && this.componentService.msgService.create(message.type, `${message.field}: ${message.message}`);
  }

  /**
   * ??????
   */
  public checkAll($value: boolean): void {
    //
    this.dataList
      .filter((item) => !this.mapOfDataState[item[this.KEY_ID]]['dislabled'])
      .map((item) => (this.mapOfDataState[item[this.KEY_ID]].checked = $value));
    this.dataCheckedStatusChange();
  }

  /**
   * ???????????????????????????CheckBox
   */
  public dataCheckedStatusChange() {
    this.isAllChecked = this.dataList
      .filter((item) => !this.mapOfDataState[item[this.KEY_ID]]['dislabled'])
      .every((item) => this.mapOfDataState[item[this.KEY_ID]].checked);

    this.indeterminate =
      this.dataList
        .filter((item) => !this.mapOfDataState[item[this.KEY_ID]]['dislabled'])
        .some((item) => this.mapOfDataState[item[this.KEY_ID]].checked) && !this.isAllChecked;

    this.checkedNumber = this.dataList.filter((item) => this.mapOfDataState[item[this.KEY_ID]].checked).length;

    // ??????????????????????????????
    this.ROWS_CHECKED = this.dataList
      .filter((item) => !this.mapOfDataState[item[this.KEY_ID]]['dislabled'])
      .filter((item) => this.mapOfDataState[item[this.KEY_ID]].checked);
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
    this.ROW_CURRENT = dataOfState;
    $event && $event.stopPropagation();
    const trigger = new ButtonOperationResolver(this.componentService, this.config, dataOfState);
    trigger.toolbarAction(actionCfg, this.config.id);
    $event && $event.preventDefault();
  }

  getRowActions(state): any[] {
    const orginAction = this.tableColumns.find((c) => c.type === 'action');
    const copyAction = [];
    if (orginAction) {
      const actions = JSON.parse(
        JSON.stringify(
          this.tableColumns
            .find((c) => c.type === 'action')
            .action.filter((c) => {
              const isHideen = this.Actions_toggle(c, state);
              return isHideen;
            }),
        ),
      );
      copyAction.push(...actions);
    }
    return copyAction;
  }

  Actions_toggle(btn?, state?) {
    if (btn.toggle && btn.toggle.type) {
      switch (btn.toggle.type) {
        case 'state':
          if (btn.toggle.values) {
            const valueObj = btn.toggle.values.find((val) => val.name === state);
            if (valueObj) {
              return !valueObj.value;
            }
          }

          break;
        case '...':
          break;
      }
    }
    return false;
  }
  /**
   *
   * @param v {id, name, value, count}
   */
  public valueChange(v?) {
    console.log('?????????', v, this._dataList, this.mapOfDataState);
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
                if (item.caseValue.type === 'value') {
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
                this.mapOfDataState[v.id].data[cascadeObj.cascadeName] = __setValue;
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
    this.columnSummary(v);

    this.updateValue_dataList('feild');
  }

  // liu 200512 ????????????????????????????????????????????????????????????
  public updateValue_dataList(type?) {
    if (type !== 'feild') {
      this.dataList.forEach((item, index) => {
        // item['_index'] = index+1;
        this.mapOfDataState[item[this.KEY_ID]].data._index = index + 1;
        this.mapOfDataState[item[this.KEY_ID]].originData._index = index + 1;
      });
      this.dataList = this.dataList.filter((item) => item.state !== 'delete');
    }
    const list: any = [];
    // tslint:disable-next-line:forin
    for (const mv in this.mapOfDataState) {
      list.push(this.mapOfDataState[mv].data);
    }
    this._dataList = list;
    console.log('????????????', this.dataList, this.mapOfDataState);
    this.updateValue.emit(list);
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

  public L_columnSummary() {
    this.tableColumns.forEach((col) => {
      if (col.field && col.summary) {
        switch (col.summary.type) {
          case 'sum':
            this.tempValue[col.summary.name] = this.colSum(col.field);
            this.staticTableSummary[col.summary.name] = this.tempValue[col.summary.name];
            break;
          case 'avg':
            this.tempValue[col.summary.name] = this.colAvg(col.field).toFixed(col.summary.fixed ? col.summary.fixed : 2);
            this.staticTableSummary[col.summary.name] = this.tempValue[col.summary.name];
            break;
          case 'max':
            this.tempValue[col.summary.name] = this.colMax(col.field);
            this.staticTableSummary[col.summary.name] = this.tempValue[col.summary.name];
            break;
          case 'min':
            this.tempValue[col.summary.name] = this.colMin(col.field);
            this.staticTableSummary[col.summary.name] = this.tempValue[col.summary.name];
            break;
        }
      }
    });
  }

  public columnSummary(value) {
    this.tableColumns.forEach((col) => {
      if (value.name === col.field && col.summary) {
        switch (col.summary.type) {
          case 'sum':
            this.tempValue[col.summary.name] = this.colSum(value.name);
            this.staticTableSummary[col.summary.name] = this.tempValue[col.summary.name];
            break;
          case 'join':
            this.tempValue[col.summary.name] = this.colJoin(value.name);
            this.staticTableSummary[col.summary.name] = this.tempValue[col.summary.name];
            break;
          case 'avg':
            this.tempValue[col.summary.name] = this.colAvg(value.name).toFixed(col.summary.fixed ? col.summary.fixed : 2);
            this.staticTableSummary[col.summary.name] = this.tempValue[col.summary.name];
            break;
          case 'max':
            this.tempValue[col.summary.name] = this.colMax(value.name);
            this.staticTableSummary[col.summary.name] = this.tempValue[col.summary.name];
            break;
          case 'min':
            this.tempValue[col.summary.name] = this.colMin(value.name);
            this.staticTableSummary[col.summary.name] = this.tempValue[col.summary.name];
            break;
        }
      }
    });
  }

  private colSum(colName) {
    let sum = 0;
    this.dataList.forEach((d) => {
      if (d.$state$ !== 'delete') {
        if (d[colName]) {
          const val = d[colName];
          //  sum = sum + Number(val);
          sum = parseFloat((sum + Number(val)).toFixed(10));
        }
      }
    });
    return sum;
  }

  private colJoin(colName) {
    let sum = '';
    // this.dataList.forEach(d => {
    //     if (d['$state$'] !== "delete")
    //         if (d[colName]) {
    //             const val = d[colName];
    //             //  sum = sum + Number(val);
    //             sum = sum + val + ',';
    //         }
    // })
    let n = 0;
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < this.dataList.length; i++) {
      if (this.dataList[i].$state$ !== 'delete') {
        if (this.dataList[i][colName]) {
          const val = this.dataList[i][colName];
          //  sum = sum + Number(val);
          sum = sum + val + ',';
          n++;
        }
      }
    }
    if (n > 0 && sum.length > 0) {
      sum = sum.substring(0, sum.length - 1);
    }

    return sum;
  }

  private colAvg(colName) {
    let sum = 0;
    if (this.dataList.length > 0) {
      this.dataList.forEach((d) => {
        if (d[colName]) {
          const val = d[colName];
          // sum = sum + Number(val);
          sum = parseFloat((sum + Number(val)).toFixed(10));
        }
      });
      return Number(parseFloat((sum / this.dataList.length).toFixed(10)));
    } else {
      sum = 0;
      return sum;
    }
  }

  private colMax(colName) { }

  private colMin(colName) { }

  /**
   * setChangeValue ?????? ???????????????
   */
  public setChangeValue(ChangeValues?) {
    console.log('statictable____changeValue', ChangeValues);
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

  public createMapd() {
    // ??????group??????

    const grouparry = {};
    // ???????????????
    this.rowConfig.forEach((r_c) => {
      if (r_c.colName) {
        if (!grouparry[r_c.colName]) {
          grouparry[r_c.colName] = [];
        }

        this.listOfData.forEach((row) => {
          this.mapd[row.id] = {}; // ?????????
          const groupObj = grouparry[r_c.colName].find((groupvalue) => row[r_c.groupName] === groupvalue);
          if (!groupObj) {
            grouparry[r_c.colName].push(row[r_c.groupName]);
          }
        });
      }
    });

    // ?????? group ??????????????????  merge

    this.rowConfig.forEach((r_c) => {
      this.listOfData.forEach((row) => {
        if (!this.mapd[row.id][r_c.colName]) {
          this.mapd[row.id][r_c.colName] = {};
        }
        let new_data = [...this.listOfData];
        r_c.groupCols.forEach((group_col) => {
          new_data = new_data.filter((d) => d[group_col.groupColName] === row[group_col.groupColName]);
        });

        new_data = new_data.filter((d) => d[r_c.groupName] === row[r_c.groupName]);
        const group_num = new_data.length;
        const group_index = new_data.findIndex((d) => d.id === row.id);
        this.mapd[row.id][r_c.colName].groupNum = group_num;
        this.mapd[row.id][r_c.colName].groupIndex = group_index + 1;
        this.mapd[row.id][r_c.colName].colgroupIndex = 1;
        this.mapd[row.id][r_c.colName].colgroupNum = 1;
      });
    });

    this.listOfData.forEach((row) => {
      // this.mapd[row.id]={}; // ?????????

      this.colConfig.forEach((col_c) => {
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
              if (!this.mapd[row.id][merge_col.mergeColName]) {
                this.mapd[row.id][merge_col.mergeColName] = {};
              }
              const group_index = item.mergeCols.findIndex((d) => d.mergeColName === merge_col.mergeColName);
              this.mapd[row.id][merge_col.mergeColName].colgroupIndex = group_index + 1;
              this.mapd[row.id][merge_col.mergeColName].colgroupNum = group_num;
            });
          }
        });
      });
    });

    console.log('??????????????????', grouparry, this.mapd);
  }

  public createMapd1() {
    this.mapd = { ...this.mapd1 };
    console.log('??????', this.mapd);
  }

  public _createMapd_new(mergeconfig?, listOfData?) {
    // ??????group??????

    const mergeData = {};

    listOfData.forEach((row) => {
      mergeData[row.id] = {}; // ?????????
    });

    // ?????? group ??????????????????  merge

    mergeconfig.rowConfig &&
      mergeconfig.rowConfig.forEach((r_c) => {
        listOfData.forEach((row) => {
          if (!mergeData[row.id][r_c.colName]) {
            mergeData[row.id][r_c.colName] = {};
          }
          let new_data = [...listOfData];
          r_c.groupCols.forEach((group_col) => {
            new_data = new_data.filter((d) => d[group_col.groupColName] === row[group_col.groupColName]);
          });

          new_data = new_data.filter((d) => d[r_c.groupName] === row[r_c.groupName]);
          const group_num = new_data.length;
          const group_index = new_data.findIndex((d) => d.id === row.id);
          mergeData[row.id][r_c.colName].groupNum = group_num;
          mergeData[row.id][r_c.colName].groupIndex = group_index + 1;
          mergeData[row.id][r_c.colName].colgroupIndex = 1;
          mergeData[row.id][r_c.colName].colgroupNum = 1;
        });
      });

    mergeconfig.colConfig &&
      this.listOfData.forEach((row) => {
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
                if (!mergeData[row.id][merge_col.mergeColName]) {
                  mergeData[row.id][merge_col.mergeColName] = {};
                }
                const group_index = item.mergeCols.findIndex((d) => d.mergeColName === merge_col.mergeColName);
                mergeData[row.id][merge_col.mergeColName].colgroupIndex = group_index + 1;
                mergeData[row.id][merge_col.mergeColName].colgroupNum = group_num;
              });
            }
          });
        });
      });

    console.log('new??????????????????', mergeData);

    return mergeData;
  }

  createMapd_new() {
    this.mergeData = null;
    const new_data = this._createMapd_new(this.mergeconfig, this.listOfData2);
    this.mergeData = new_data;
  }
  createMapd1_new() {
    this.mergeData = { ...this.mergeData1 };
  }
  public transferValue(option?) {
    console.log('?????????????????????');
  }



  public addBtnClick_tanchu(event?) {
    console.log('addBtnClick', event);
    if (event) {
      if (event.code === 'Enter') {
        return false;
      }
    }
    this.addRow();
    this.updateValue.emit(this.getAddedNewRowsData());
  }

  isVisible = false;
  showModal(): void {
    this.isVisible = true;
  }

  handleOk(): void {
    console.log('Button ok clicked!');
    this.isVisible = false;
  }

  handleCancel(): void {
    console.log('Button cancel clicked!');
    this.isVisible = false;
  }

  current = 0;

  index = 'First-content';

  pre(): void {
    this.current -= 1;
    this.changeContent();
  }

  next(): void {
    this.current += 1;
    this.changeContent();
  }

  done(): void {
    console.log('done');
  }

  changeContent(): void {
    switch (this.current) {
      case 0: {
        this.index = 'First-content';
        break;
      }
      case 1: {
        this.index = 'Second-content';
        break;
      }
      case 2: {
        this.index = 'third-content';
        break;
      }
      default: {
        this.index = 'error';
      }
    }
  }


}
