import { Component, OnInit, EventEmitter, Input, Output, Inject } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { BSN_COMPONENT_SERVICES } from 'src/app/core/relations/bsn-relatives';
import { ComponentServiceProvider } from 'src/app/core/services/components/component.service';
import { CommonUtils } from 'src/app/core/utils/common-utils';
import { ParameterResolver } from 'src/app/shared/resolver/parameter/parameter.resolver';
import { CnComponentBase } from '../../../cn-component.base';

@Component({
  selector: 'app-cfg-attribute-form-state',
  templateUrl: './cfg-attribute-form-state.component.html',
  styles: [
  ]
})
export class CfgAttributeFormStateComponent extends CnComponentBase implements OnInit {
  backValue: any;
  formStateEditCache: { [key: string]: { edit: boolean; data: any } } = {};
  form: FormGroup;

  @Input() rowData; // 接收组件的面板名称
  @Input() config;
  // @Input() Controls; // 传入的Controls集合
  @Output() public updateValue = new EventEmitter();
  public formStateDataList: any = [];

  public unSelectedColumnsMap: any = [];

  public formIsVisible: any = false;

  public formSateMapping: any[] = [];

  public controlList: any[] = [];

  InitCascadeEditIndex = -1;

  editObj = {};

  public formState: any;

  public tempControlsConfig: any[] = [];

  public tempformControlsPermissions: any[] = [];

  public controlsOfPanelMapping: Array<{ id: string; label: string; active: boolean }> = [];

  public Controls = [
    {
      id: '001',
      label: '姓名'
    },
    {
      id: '002',
      label: '年龄'
    },
    {
      id: '003',
      label: '性别'
    },
    {
      id: '004',
      label: '职务'
    }
  ]

  constructor(
    @Inject(BSN_COMPONENT_SERVICES)
    public componentService: ComponentServiceProvider,
    private fb: FormBuilder,
  ) { super(componentService); }

  ngOnInit() {
    this.initForm();
    this.initControls();
    this.getInitData();
  }

  public ngAfterViewInit() {
  }

  public setValue(data?) {
    // this.receiverValue.emit(data);
  }

  public async getInitData() {
    // await this.load_data();
    this.createTableData();
    this.createCascadeTableData();
  }

  public initForm() {
    this.form = this.fb.group({
      isLoadData: [undefined, [Validators.required]],
      isLoadDeafult: [null, [Validators.required]],
      isInitCascade: [null, [Validators.required]],
      deafultContent: [null],
      InitCascade: this.fb.array([]),
      controlArray: this.fb.array([]),
    });
  }

  public initControls() {
    this.tempControlsConfig = []; // 初始化临时数组
    for (let i = 0; i < this.Controls.length; i++) {
      this.tempControlsConfig.push({
        "id": this.Controls[i].id,
        "state": this.formState,
        "hidden": false,
        "readOnly": false
      });
    }
  }

  get InitCascade() {
    return this.form.controls.InitCascade as FormArray;
  }
  get isLoadData() {
    return this.form.controls.isLoadData.value;
  }
  get isLoadDeafult() {
    return this.form.controls.isLoadDeafult.value;
  }
  get isInitCascade() {
    return this.form.controls.isInitCascade.value;
  }
  get deafultContent() {
    return this.form.controls.deafultContent.value;
  }
  get controlArray() {
    return this.form.controls.controlArray.value;
  }

  public createCascadeTableData(type?) {
    if (this.formSateMapping.findIndex(e => e['type'] === type) > -1) {

    } else {
      this.controlList.forEach(i => {
        const field = this.createUser();
        if (field) {
          field.patchValue(i);
          this['InitCascade'].push(field); // 先不写读取数据的资源，确定个表结构之后需要修改
          this.formSateMapping.push({
            type: type,
            isCreate: true
          });
        }

        // this.ajaxOptionsConfig.push(field);
      });
    }
  }

  createUser(): FormGroup {
    return this.fb.group({
      type: [null, [Validators.required]],
      valueName: [null, [Validators.required]],
      controlId: [null, [Validators.required]],
      value: [null],
      name: [null, [Validators.required]],
    });
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
  public createTableData() {
    const length = this.formStateDataList.length > 0 ? this.formStateDataList.length : 0
    return {
      id: `${length}`,
      formStateName: ``,
      isFormContent: ``
    }
  }

  _submitForm() {
    // console.log(this.form.value);
    const formStateObj = {
      "formState": this.formState,
      "formStateContent": {
        "isLoad": this.form.value.isLoadData,
        "loadAjax": {},
        "isDefault": this.form.value.isLoadDeafult,
        "defaultComponentValue": this.form.value.isLoadDeafult ? this.form.value.deafultContent : {},
        "triggerFeilds": this.form.value.InitCascade.length > 0 ? this.form.value.InitCascade : []
      },
      "Controls": this.tempControlsConfig
    }
    if (this.tempformControlsPermissions.length > 0) {
      const index = this.tempformControlsPermissions.findIndex(e => e['formState'] === this.formState)
      if (index > -1) {
        this.tempformControlsPermissions[index] = formStateObj;
      } else {
        this.tempformControlsPermissions.push(formStateObj);
      }
    } else {
      this.tempformControlsPermissions.push(formStateObj);
    }
  }

  submitConfig() {
    console.log(this.tempformControlsPermissions);
  }

  assembleIinitCascade() {
    const initCascadeArray = [];
    if (this.form.value.InitCascade.length > 0) {

    }
    return initCascadeArray;
  }

  set(state): void {
    this.formIsVisible = true;
    this.formState = state;
    if (this.controlsOfPanelMapping.length === 0) {
      for (let i = 0; i < this.Controls.length; i++) {
        this.controlsOfPanelMapping.push({
          id: this.Controls[i]['id'],
          label: this.Controls[i]['label'],
          active: i === 0 ? true : false
        })
      }
    }
  }

  _resetForm(): void {
    this.form.reset();
  }

  hiddenChange($event, id): void {
    // console.log('hiddenChange', $event, id);
    const index = this.tempControlsConfig.findIndex(e => e.id === id)
    this.tempControlsConfig[index]['hidden'] = $event
  }

  readOnlyChange($event, id): void {
    // console.log('readOnlyChange', $event, id);
    const index = this.tempControlsConfig.findIndex(e => e.id === id)
    this.tempControlsConfig[index]['readOnly'] = $event
  }

  handleCancel(): void {
    this.formIsVisible = false;
    this.initForm();
  }

  add() {
    // 判断数组是否已经存在数据进行不同的处理
    let tableList = this.formStateDataList;
    const tableItemObj = this.createTableData()
    if (tableList.length > 0) {
      tableList = [...tableList, { ...tableItemObj }]
    } else {
      tableList = [{ ...tableItemObj }]
    }
    this.formStateDataList = tableList;
    this.pushEditCache(tableItemObj);
  }

  startEdit(id: string): void {
    this.formStateEditCache[id].edit = true;
  }

  cancelEdit(id: string): void {
    const index = this.formStateDataList.findIndex(item => item.id === id);
    this.formStateEditCache[id] = {
      data: { ...this.formStateDataList[index] },
      edit: false
    };
  }

  saveEdit(id: string): void {
    const index = this.formStateDataList.findIndex(item => item.id === id);
    const state = this.formStateEditCache[id].data['formStateName'];
    Object.assign(this.formStateDataList[index], this.formStateEditCache[id].data);
    this.formStateEditCache[id].edit = false;
    // console.log(this.formStateEditCache);
    const formStateObj = {
      "formState": state,
      "formStateContent": {
        "isLoad": false,
        "loadAjax": {},
        "isDefault": false,
        "defaultComponentValue": {},
        "triggerFeilds": []
      },
      "Controls": this.tempControlsConfig
    }
    if (this.tempformControlsPermissions.length > 0) {
      const index = this.tempformControlsPermissions.findIndex(e => e['formState'] === this.formState)
      if (index > -1) {
        this.tempformControlsPermissions[index] = formStateObj;
      } else {
        this.tempformControlsPermissions.push(formStateObj);
      }
    } else {
      this.tempformControlsPermissions.push(formStateObj);
    }
    // console.log(this.tempformControlsPermissions);
  }

  pushEditCache(tableItemObj): void {
    this.formStateEditCache[tableItemObj.id] = {
      edit: true,
      data: { ...tableItemObj }
    };
  }

  updateEditCache(): void {
    this.formStateDataList.forEach(item => {
      this.formStateEditCache[item.id] = {
        edit: false,
        data: { ...item }
      };
    });
  }

  deleteRow(id: string): void {
    this.formStateDataList = this.formStateDataList.filter(d => d.id !== id);
  }

  addCascade() {
    // console.log(type);
    this['InitCascade'].push(this.createUser());
    this.edit(this['InitCascade'].length - 1);
    // this.ajaxOptionsConfig.push(this.createUser(type));
    // this.edit(this.ajaxOptionsConfig.length - 1);
  }

  del(index: number) {
    this['InitCascade'].removeAt(index);
    // this.ajaxOptionsConfig.removeAt(index);
  }

  edit(index: number) {
    if (this.InitCascadeEditIndex !== -1 && this.editObj) {
      this['InitCascade'].at(this.InitCascadeEditIndex).patchValue(this.editObj);
      // this.ajaxOptionsConfig.at(this.InitCascadeEditIndex).patchValue(this.editObj);
    }
    this.editObj = { ...this['InitCascade'].at(index).value };
    this.InitCascadeEditIndex = index;
  }

  save(index: number) {
    this['InitCascade'].at(index).markAsDirty();
    if (this['InitCascade'].at(index).invalid) { return; }
    // this.ajaxOptionsConfig.at(index).markAsDirty();
    // if (this.ajaxOptionsConfig.at(index).invalid) { return; }
    this.InitCascadeEditIndex = -1;
  }

  cancel(index: number) {
    if (!this['InitCascade'].at(index).value.key) {
      this.del(index);
    } else {
      this['InitCascade'].at(index).patchValue(this.editObj);
    }
    // if (!this.ajaxOptionsConfig.at(index).value.key) {
    //   this.del(type, index);
    // } else {
    //   this.ajaxOptionsConfig.at(index).patchValue(this.editObj);
    // }
    this.InitCascadeEditIndex = -1;
  }
}