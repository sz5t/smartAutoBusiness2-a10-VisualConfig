import { Component, OnInit, EventEmitter, Input, Output, Inject, ChangeDetectorRef } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { BSN_COMPONENT_SERVICES } from 'src/app/core/relations/bsn-relatives';
import { ComponentServiceProvider } from 'src/app/core/services/components/component.service';
import { CommonUtils } from 'src/app/core/utils/common-utils';
import { ParameterResolver } from 'src/app/shared/resolver/parameter/parameter.resolver';
import { CnComponentBase } from '../../../cn-component.base';

@Component({
  selector: 'app-cfg-attribute-ranks-comb',
  templateUrl: './cfg-attribute-ranks-comb.component.html',
  styles: [
  ]
})
export class CfgAttributeRanksCombComponent extends CnComponentBase implements OnInit {
  editObj = {};
  isVisible = false;
  backValue: any;
  rowData: any = {};
  responseArray: any = [];
  isCondition: any = false;
  enableRowMerge: any = true;
  enableColMerge: any = true;
  colEditCache: { [key: string]: { edit: boolean; data: any } } = {};

  @Input() panelId; // 接收组件的面板ID
  @Input() panelName; // 接收组件的面板名称
  @Input() config;
  @Output() public updateValue = new EventEmitter();

  colForm: FormGroup;
  rowForm: FormGroup;
  buttonForm: FormGroup;

  rowGroupEditIndex = -1;
  colGroupEditIndex = -1;
  queryParamsEditIndex = -1;
  bodyParamsEditIndex = -1;

  public EditIndexMapping: any = {
    rowGroup: 'rowGroupEditIndex',
    colGroup: 'colGroupEditIndex'
  }

  public mergeGroupMapping: any = {
    rowGroup: 'colTableList',
    colGroup: 'rowTableList'
  }

  public rowTableList: any = [];
  public colTableList: any = [];

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

    this.colForm = this.fb.group({
      colColName: [null],
      colGroupName: [null],
      colTableData: [null]
    });

    this.rowForm = this.fb.group({
      rowColName: [null],
      stageContent: this.fb.array([
        this.creatRow()
      ])
    });
    this.getInitData();
  }

  public ngAfterViewInit() {
  }

  public setValue(data?) {
    // this.receiverValue.emit(data);
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

  createUser(type): FormGroup {
    switch (type) {
      case 'rowGroup':
        return this.fb.group({
          key: [null],
          singleEdit: [null],
          groupColName: [null, [Validators.required]],
        });
      case 'colGroup':
        return this.fb.group({
          key: [null],
          singleEdit: [null],
          mergeColName: [null, [Validators.required]],
        });
    }
  }

  //#region get form fields
  // get enableRowMerge() {
  //   return this.buttonForm.controls.enableRowMerge.value;
  // }
  // get enableColMerge() {
  //   return this.buttonForm.controls.enableColMerge.value;
  // }
  get colColName() {
    return this.colForm.controls.colColName.value;
  }
  get colGroupName() {
    return this.colForm.controls.colGroupName.value;
  }
  // get colTableData() {
  //   return this.colForm.controls.colTableData.value;
  // }
  get rowColName() {
    return this.rowForm.controls.rowColName.value;
  }

  get testArrFormArray(): FormArray {
    return this.rowForm.controls['stageContent'] as FormArray;
  }
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
    this.pushEditCache(tableItemObj);
  }

  del(groupName: string, index: number) {
    this[this.mergeGroupMapping[groupName]].removeAt(index);
  }

  edit(groupName: string, index: number) {
    if (this[this.EditIndexMapping[groupName]] !== -1 && this.editObj) {
      this[this.mergeGroupMapping[groupName]].at(this[this.EditIndexMapping[groupName]]).patchValue(this.editObj);
    }
    this.editObj = { ...this[this.mergeGroupMapping[groupName]].at(index).value };
    this[this.EditIndexMapping[groupName]] = index;
  }

  save(groupName: string, index: number) {
    this[this.mergeGroupMapping[groupName]].at(index).markAsDirty();
    if (this[this.mergeGroupMapping[groupName]].at(index).invalid) { return; }
    this[this.EditIndexMapping[groupName]] = -1;
  }

  cancel(groupName: string, index: number) {
    if (!this[this.mergeGroupMapping[groupName]].at(index).value.key) {
      this.del(groupName, index);
    } else {
      this[this.mergeGroupMapping[groupName]].at(index).patchValue(this.editObj);
    }
    this[this.EditIndexMapping[groupName]] = -1;
  }

  creatRow1() {
    return this.fb.group({
      isCondition: new FormControl(null, [Validators.required]),
      colParamsType: new FormControl(null),
      colParamsName: new FormControl(null),
      colParamsExpression: new FormControl(null),
      // mergeRowNameArray: this.fb.array([]),
    });
  }

  creatRow() {
    return this.fb.group({
      isCondition: new FormControl(null, Validators.required),
      rowParamsType: new FormControl(null),
      rowParamsName: new FormControl(null),
      rowParamsExpression: new FormControl(null),
      rowTableData: new FormControl(null),
    });
  }

  //新增组合
  addItem() {
    this.testArrFormArray.push(this.creatRow());
  }
  //刪除组合
  delItem(i) {
    this.testArrFormArray.removeAt(i);
  }

  set(i): void {
    this.isVisible = true;
    // this.rowData = this.form.value.ReceiverOptionsConfig[i];
    // console.log(this.form.value, i, this.rowData);
  }

  handleOk() {

  }

  handleCancel() {
    this.isVisible = false;
  }

  _submitForm() {

  }

  startEdit(type: string, id: string): void {
    this.colEditCache[id].edit = true;
  }

  cancelEdit(type: string, id: string): void {
    const index = this.colTableList.findIndex(item => item.id === id);
    this.colEditCache[id] = {
      data: { ...this.colTableList[index] },
      edit: false
    };
  }

  saveEdit(type: string, id: string): void {
    const index = this.colTableList.findIndex(item => item.id === id);
    Object.assign(this.colTableList[index], this.colEditCache[id].data);
    this.colEditCache[id].edit = false;
  }

  pushEditCache(tableItemObj): void {
    this.colEditCache[tableItemObj.id] = {
      edit: false,
      data: { ...tableItemObj }
    };
  }

  updateEditCache(): void {
    this.colTableList.forEach(item => {
      this.colEditCache[item.id] = {
        edit: false,
        data: { ...item }
      };
    });
  }

  deleteRow(id: string): void {
    this.colTableList = this.colTableList.filter(d => d.id !== id);
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

  /**
   * valueChange
v?   */
  public valueChange(v?) {
    // console.log('value', v);
    this.handleCancel();
    this.backValue = {};
    // console.log('backValue', this.backValue);
    this.updateValue.emit(this.backValue);
  }
}
