import { Component, OnInit, EventEmitter, Input, Output, Inject } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { BSN_COMPONENT_SERVICES } from 'src/app/core/relations/bsn-relatives';
import { ComponentServiceProvider } from 'src/app/core/services/components/component.service';
import { CnComponentBase } from '../../../cn-component.base';

@Component({
  selector: 'app-cfg-attribute-ranks-row-modal',
  templateUrl: './cfg-attribute-ranks-row-modal.component.html',
  styles: [
  ]
})
export class CfgAttributeRanksRowModalComponent extends CnComponentBase implements OnInit {
  editObj = {};
  colModalVisible = false;
  rowModalVisible = false;
  backValue: any;
  colRowData: any = {};
  rowRowData: any = {};
  isCondition: any = false;
  enableRowMerge: any = true;
  enableColMerge: any = true;
  colEditCache: { [key: string]: { edit: boolean; data: any } } = {};
  rowEditCache: { [key: string]: { edit: boolean; data: any } } = {};
  tempRowData: any = {};
  rowForm: FormGroup;

  @Input() panelId; // 接收组件的面板ID
  @Input() rowData; // 接收组件的面板名称
  @Input() columns;
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

  constructor(
    @Inject(BSN_COMPONENT_SERVICES)
    public componentService: ComponentServiceProvider,
    private fb: FormBuilder,
  ) { super(componentService); }

  ngOnInit() {
    this.rowForm = this.fb.group({
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
  }

  colModalhandleCancel() {
    this.colModalVisible = false;
  }

  rowModalhandleCancel() {
    this.rowModalVisible = false;
  }

  _submitForm() {

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

  changeCondition($event) {
    this.isCondition = $event
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
  public valueChange(v?) {
    // console.log('value', v);
    if (this.tempRowData && this.tempRowData.hasOwnProperty(v.id)) {
      this.tempRowData[v.id] = v.mergeCols
    } else {
      this.tempRowData = { ...{ [v.id]: v.mergeCols } }
    }
    // console.log('tempRowData', this.tempRowData);
    // console.log('formValue', this.rowForm.value);
    const array = this.assembleMergeItems(this.tempRowData, this.rowForm.value);
    this.backValue = {
      "colName": this.rowData['colName'],
      "mergeItems": array
    };
    // console.log('backValue', this.backValue);
    this.updateValue.emit(this.backValue);
  }

  public assembleMergeItems(tempRowData, formValue) {
    const mergeItems: any = [];
    let caseValueObj: any = {};
    let mergeColsTemp: any = [];
    for (let i = 0; i < formValue.stageContent.length; i++) {
      if (formValue.stageContent[i].isCondition) {
        caseValueObj = {
          "type": formValue.stageContent[i]['rowParamsType'],
          "valueName": formValue.stageContent[i]['rowParamsName'],
          "regular": formValue.stageContent[i]['rowParamsExpression'],
          "value": ""
        }
      }
      mergeColsTemp = tempRowData[i]
      mergeItems.push({
        "type": "condition",
        "caseValue": caseValueObj,
        "mergeCols": mergeColsTemp
      }
      )
    }
    return mergeItems
  }
}
