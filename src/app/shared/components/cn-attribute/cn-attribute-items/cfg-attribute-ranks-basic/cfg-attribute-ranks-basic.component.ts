import { Component, OnInit, EventEmitter, Input, Output, Inject } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { BSN_COMPONENT_SERVICES } from 'src/app/core/relations/bsn-relatives';
import { ComponentServiceProvider } from 'src/app/core/services/components/component.service';
import { CnComponentBase } from '../../../cn-component.base';

@Component({
  selector: 'app-cfg-attribute-ranks-basic',
  templateUrl: './cfg-attribute-ranks-basic.component.html',
  styles: [
  ]
})
export class CfgAttributeRanksBasicComponent extends CnComponentBase implements OnInit {
  editObj = {};
  colModalVisible = false;
  rowModalVisible = false;
  backValue: any;
  colRowData: any = {};
  rowRowData: any = {};
  enableRowMerge: any = true;
  enableColMerge: any = true;
  colEditCache: { [key: string]: { edit: boolean; data: any } } = {};
  rowEditCache: { [key: string]: { edit: boolean; data: any } } = {};

  rowConfig: any = [];
  colConfig: any = [];

  buttonForm: FormGroup;
  rowForm: FormGroup;

  @Input() panelId; // 接收组件的面板ID
  @Input() panelName; // 接收组件的面板名称
  @Input() config;
  @Output() public updateValue = new EventEmitter();

  public mergeGroupMapping: any = {
    colGroup: 'colTableList',
    rowGroup: 'rowTableList'
  }

  public editCacheMapping: any = {
    colGroup: 'colEditCache',
    rowGroup: 'rowEditCache'
  }

  public rowTableList: any = [];
  public colTableList: any = [];



  public columns: any = [
    {
      "title": "ID",
      "type": "field",
      "field": "ID",
      "hidden": true,
      "showFilter": false,
      "showSort": false,
      "width": "220px",
      "style": {}
    },
    {
      "title": "菜单名称",
      "type": "field",
      "field": "MODULE_NAME",
      "titleAlign": "center",
      "align": "center",
      "hidden": false,
      "showFilter": false,
      "showSort": true,
      "style": {},
      "editor": {
        "type": "input",
        "field": "MODULE_NAME"
      }
    },
    {
      "title": "操作组件ID",
      "type": "field",
      "field": "COMPONENT_ID",
      "hidden": false,
      "showFilter": false,
      "showSort": false,
      "style": {},
      "editor": {
        "type": "input",
        "field": "COMPONENT_ID"
      }
    },
    {
      "title": "操作功能",
      "type": "field",
      "field": "FUNC_NAME",
      "hidden": false,
      "showFilter": false,
      "showSort": false,
      "style": {}
    },
    {
      "title": "描述",
      "type": "field",
      "field": "DESCRIPTION",
      "hidden": false,
      "showFilter": false,
      "showSort": false,
      "style": {}
    },
    {
      "title": "操作人",
      "type": "field",
      "field": "USER_NAME",
      "hidden": false,
      "showFilter": false,
      "showSort": false,
      "style": {}
    },
    {
      "title": "操作时间",
      "type": "field",
      "field": "CREATE_DATE",
      "hidden": false,
      "showFilter": false,
      "showSort": true,
      "style": {}
    }
  ]

  constructor(
    @Inject(BSN_COMPONENT_SERVICES)
    public componentService: ComponentServiceProvider,
    private fb: FormBuilder,
  ) { super(componentService); }

  ngOnInit() {
    this.buttonForm = this.fb.group({
      enableRowMerge: [null],
      enableColMerge: [null]
    });
    this.rowForm = this.fb.group({
      rowColName: [null],
      stageContent: this.fb.array([
        this.creatRow()
      ])
    });
    if (this.updateValue) {
      this.updateValue.subscribe((event) => {
        this.setValue(event);
      });
    }
    this.getInitData();
  }

  public ngAfterViewInit() {
  }

  get testArrFormArray(): FormArray {
    return this.rowForm.controls['stageContent'] as FormArray;
  }

  public setValue(data?) {
    // this.updateValue.emit(data);
  }

  public async getInitData() {
    await this.load_data();
    this.createTableData();
  }

  /**
   * load_data 读取需要的数据
   */
  public async load_data() {
    if (this.config.cascadeTypeConfig) {
      const sendPanelConfig = this.assembleAjax(this.config.cascadeTypeConfig);
      if (sendPanelConfig['id']) {
        const sendData = await this.getData(sendPanelConfig);
        if (sendData.data.length > 0) {
          // this.userList = sendData.data;
        }
      }
    }
  }

  /**
   * assembleAjax 组装AJAX结构
   */
  public assembleAjax(config) {
    let ajaxId;
    ajaxId = config.ajaxId
    this.config.ajaxConfig.forEach(ajax => {
      if (ajax['id'] === ajaxId) {
        config = ajax
      }
    });
    return config;
  }

  /**
   * getData 读取数据
   */
  public async getData(config) {
    const url = config.url;
    const method = config.method ? config.method : config.ajaxType;
    const response = await this.executeHttpRequest(url, method, {});
    return response;
  }

  public async executeHttpRequest(url, method, paramData) {
    return this.componentService.apiService[method](url, paramData).toPromise();
  }

  /**
   * 动态生成表数据
   */
  public createTableData(type?) {
    const length = type ? this[this.mergeGroupMapping[type]].length : 0
    switch (type) {
      case 'rowGroup':
        return {
          id: `${length}`,
          mergeColName: `1`,
          singleEdit: `true`
        }
      case 'rowGroup':
        return {
          id: `${length}`,
          groupColName: ``,
          singleEdit: ``
        }
      default:
        return {
          id: `${length}`,
          mergeColName: ``,
          groupColName: ``,
          singleEdit: ``
        }
    }
  }

  //#region get form fields
  //#endregion

  add(groupName: string) {
    // 判断数组是否已经存在数据进行不同的处理
    let tableList = this[this.mergeGroupMapping[groupName]];
    const tableItemObj = this.createTableData(groupName)
    if (tableList.length > 0) {
      tableList = [...tableList, { ...tableItemObj }]
    } else {
      tableList = [{ ...tableItemObj }]
    }
    this[this.mergeGroupMapping[groupName]] = tableList;
    this.pushEditCache(tableItemObj, groupName);
  }

  setColMerge(i): void {
    this.colModalVisible = true;
    this.colRowData = this.colTableList.find(e => e['id'] === i);
  }

  setRowMerge(i): void {
    this.rowModalVisible = true;
    this.rowRowData = this.rowTableList.find(e => e['id'] === i);
  }

  colModalhandleCancel() {
    this.colModalVisible = false;
  }

  rowModalhandleCancel() {
    this.rowModalVisible = false;
  }

  _submitForm() {
    const mergeconfig = {
      'rowConfig': this.enableColMerge ? this.rowConfig : [],
      'colConfig': this.enableRowMerge ? this.colConfig : []
    }
    // console.log(mergeconfig);
  }

  startEdit(type: string, id: string): void {
    this[this.editCacheMapping[type]][id].edit = true;
  }

  cancelEdit(type: string, id: string): void {
    const index = this[this.mergeGroupMapping[type]].findIndex(item => item.id === id);
    this[this.editCacheMapping[type]][id] = {
      data: { ...this[this.mergeGroupMapping[type]][index] },
      edit: false
    };
  }

  saveEdit(type: string, id: string): void {
    const index = this[this.mergeGroupMapping[type]].findIndex(item => item.id === id);
    Object.assign(this[this.mergeGroupMapping[type]][index], this[this.editCacheMapping[type]][id].data);
    this[this.editCacheMapping[type]][id].edit = false;
  }

  pushEditCache(tableItemObj, type): void {
    this[this.editCacheMapping[type]][tableItemObj.id] = {
      edit: true,
      data: { ...tableItemObj }
    };
  }

  deleteRow(type: string, id: string): void {
    this[this.mergeGroupMapping[type]] = this[this.mergeGroupMapping[type]].filter(d => d.id !== id);
  }

  changeColMerge($event) {
    this.enableColMerge = $event;
  }

  changeRowMerge($event) {
    this.enableRowMerge = $event;
  }

  //新增组合
  addItem() {
    this.testArrFormArray.push(this.creatRow());
  }
  //刪除组合
  delItem(i) {
    this.testArrFormArray.removeAt(i);
  }

  creatRow() {
    return this.fb.group({
      isCondition: new FormControl(null, Validators.required),
      rowParamsType: new FormControl(null),
      rowParamsName: new FormControl(null),
      rowParamsExpression: new FormControl(null),
    });
  }

  /**
   * valueChange
v?   */
  public colValueChange(v?) {
    console.log('colValue', v);
    this.rowConfig = v;
    // this.handleCancel();
    this.backValue = {};
    // console.log('backValue', this.backValue);
    this.updateValue.emit(this.backValue);
  }

  public rowValueChange(v?) {
    console.log('rowValue', v);
    this.colConfig = v;
    // this.handleCancel();
    this.backValue = {};
    // console.log('backValue', this.backValue);
    this.updateValue.emit(this.backValue);
  }
}
