import { Component, OnInit, Output, EventEmitter, Input, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { BSN_COMPONENT_SERVICES } from 'src/app/core/relations/bsn-relatives';
import { ComponentServiceProvider } from 'src/app/core/services/components/component.service';
import { CnComponentBase } from '../../../cn-component.base';

@Component({
  selector: 'app-cfg-property-editor-cascade-value',
  templateUrl: './cfg-property-editor-cascade-value.component.html',
  styles: [
  ]
})
export class CfgPropertyEditorCascadeValueComponent extends CnComponentBase implements OnInit {
  @Input() public rowData;
  @Input() public config;
  @Output() public updateValue = new EventEmitter();
  editIndex = -1;
  editParamsIndex = -1;
  editObj = {};
  isVisible = false;

  form: FormGroup;


  public cascadeMapping: any = {
    ajax: 'ajaxOptionsConfig',
    setOptions: 'setOptionsConfig',
    setValue: 'setValueOptionsConfig',
    relation: 'relationOptionsConfig',
    compute: 'computeOptionsConfig',
    changeValue: 'changeValueOptionsConfig',
    updateValue: 'updateValueOptionsConfig',
  }

  public cascadeDataMapping: any = {
    ajax: 'ajaxDataList',
    setOptions: 'setOptionsDataList',
    setValue: 'setValueDataList',
    relation: 'relationDataList',
    compute: 'computeDataList',
    changeValue: 'changeValueDataList',
    updateValue: 'updateValueDataList',
  }

  public cascadeStateMapping: any[] = [];

  public symbolMapping: any[] = [];

  public cascadeValueObject: any = {};

  public ajaxDataList: any = [];
  public setOptionsDataList: any = [];
  public setValueDataList: any = [];
  public relationDataList: any = [];
  public computeDataList: any = [];
  public changeValueDataList: any = [];
  public updateValueDataList: any = [];

  public userList = [
    {
      key: '1',
      name: 'userName',
      type: 'selectValue',
      valueName: 'id',
      isDefault: false,
      label: "甲",
      value: '',
    },
    {
      key: '2',
      name: 'departmentName',
      type: 'selectObjectValue',
      valueName: 'department',
      isDefault: false,
      label: "乙",
      value: '',
    },
    {
      key: '3',
      name: 'organazationName',
      type: 'value',
      valueName: '',
      isDefault: true,
      label: "丙",
      value: 'xxx',
    },
  ];

  public symbolList = [
    {
      key: '1',
      name: 'a + b + c',
    },
    {
      key: '2',
      name: 'a - b - c',
    },
    {
      key: '3',
      name: 'a * b * c',
    },
  ];

  constructor(
    @Inject(BSN_COMPONENT_SERVICES)
    public componentService: ComponentServiceProvider,
    private fb: FormBuilder
  ) { super(componentService); }

  ngOnInit() {
    this.form = this.fb.group({
      ReceiverComponentId: [undefined, [Validators.required]],
      ReceiverComponentName: [null, [Validators.required]],
      TriggerType: [null, [Validators.required]],
      ParamsType: [null],
      ParamsName: [null],
      ParamsCondition: [null],
      ResponseMode: [null, [Validators.required]],
      SendMessageId: [null],
      ajaxOptionsConfig: this.fb.array([]),
      setOptionsConfig: this.fb.array([]),
      setValueOptionsConfig: this.fb.array([]),
      relationOptionsConfig: this.fb.array([]),
      symbolOptionsConfig: this.fb.array([]),
      computeOptionsConfig: this.fb.array([]),
      changeValueOptionsConfig: this.fb.array([]),
      updateValueOptionsConfig: this.fb.array([]),
    });
    // console.log('config', this.config);
    this.getInitData();
  }

  public ngAfterViewInit() {
  }

  /**
   * load_data
   */
  public async getInitData() {
    const ResponseMode = this.rowData ? this.rowData['receiverRelationName'] : null;
    if (ResponseMode !== null) {
      await this.load_data(ResponseMode);
      this.createTableData(ResponseMode);
      this.createSymbol();
    }
  }

  public setValue(data?) {
    this.updateValue.emit(data);
  }

  /**
   * load_data 读取需要的数据
   */
  public async load_data(cascadeType) {
    if (this.config.cascadeDataListConfig && this.config.cascadeDataListConfig.hasOwnProperty(this.cascadeDataMapping[cascadeType])) {
      const sendPanelConfig = this.assembleAjax(this.config.cascadeDataListConfig[this.cascadeDataMapping[cascadeType]]);
      if (sendPanelConfig['id']) {
        const sendData = await this.getData(sendPanelConfig);
        if (sendData.data.length > 0) {
          this[this.cascadeDataMapping[cascadeType]] = sendData.data;
          this.userList = this[this.cascadeDataMapping[cascadeType]]
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

    // const response: any = await this.componentService.apiService[method](url, method, { params }).toPromise();
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
    const ResponseMode = type ? type : this.rowData['receiverRelationName'];
    if (this.cascadeStateMapping.findIndex(e => e['type'] === type) > -1) {

    } else {
      this.userList.forEach(i => {
        const field = this.createUser(ResponseMode);
        if (field) {
          field.patchValue(i);
          this[this.cascadeMapping[ResponseMode]].push(field);
          this.cascadeStateMapping.push({
            type: ResponseMode,
            isCreate: true
          });
        }

        // this.ajaxOptionsConfig.push(field);
      });


    }
  }

  createUser(ResponseMode): FormGroup {
    switch (ResponseMode) {
      case 'ajax':
        return this.fb.group({
          key: [null],
          type: [null, [Validators.required]],
          valueName: [null, [Validators.required]],
          isDefault: [null, [Validators.required]],
          value: [null, [Validators.required]],
          name: [null, [Validators.required]],
        });
      case 'setOptions':
        return this.fb.group({
          key: [null],
          value: [null, [Validators.required]],
          label: [null, [Validators.required]],
        });
      case 'setValue':
        return this.fb.group({
          key: [null],
          type: [null, [Validators.required]],
          valueName: [null, [Validators.required]],
          isDefault: [null, [Validators.required]],
          value: [null, [Validators.required]],
          name: [null, [Validators.required]],
        });
      case 'changeValue':
        return this.fb.group({
          key: [null],
          type: [null, [Validators.required]],
          valueName: [null, [Validators.required]],
          isDefault: [null, [Validators.required]],
          value: [null, [Validators.required]],
          name: [null, [Validators.required]],
        });
      case 'updateValue':
        return this.fb.group({
          key: [null],
          type: [null, [Validators.required]],
          valueName: [null, [Validators.required]],
          isDefault: [null, [Validators.required]],
          value: [null, [Validators.required]],
          name: [null, [Validators.required]],
        });
      case 'relation':
        return this.fb.group({
          key: [null],
          type: [null, [Validators.required]],
          valueName: [null, [Validators.required]],
          isDefault: [null, [Validators.required]],
          value: [null, [Validators.required]],
          name: [null, [Validators.required]],
        });
      case 'compute':
        return this.fb.group({
          key: [null],
          type: [null, [Validators.required]],
          valueName: [null, [Validators.required]],
          isDefault: [null, [Validators.required]],
          value: [null, [Validators.required]],
          name: [null, [Validators.required]],
        });
    }
  }

  /**
   * responseModeValueChange 级联方式值改变回调
   */
  public responseModeValueChange($event) {
    this.createTableData($event);
    if ($event === 'compute') {
      this.createSymbol();
    }
  }

  //#region get form fields
  get SendComponentId() {
    return this.form.controls.SendComponentId.value;
  }
  get SendComponentName() {
    return this.form.controls.SendComponentName.value;
  }
  get ReceiverComponentId() {
    return this.form.controls.ReceiverComponentId.value;
  }
  get ReceiverComponentName() {
    return this.form.controls.ReceiverComponentName.value;
  }
  get TriggerType() {
    return this.form.controls.TriggerType.value;
  }
  get ParamsType() {
    return this.form.controls.ParamsType.value;
  }
  get ParamsName() {
    return this.form.controls.ParamsName.value;
  }
  get ParamsCondition() {
    return this.form.controls.ParamsCondition.value;
  }
  get ResponseMode() {
    return this.form.controls.ResponseMode.value;
  }
  get ajaxOptionsConfig() {
    return this.form.controls.ajaxOptionsConfig as FormArray;
  }
  get setOptionsConfig() {
    return this.form.controls.setOptionsConfig as FormArray;
  }
  get setValueOptionsConfig() {
    return this.form.controls.setValueOptionsConfig as FormArray;
  }
  get relationOptionsConfig() {
    return this.form.controls.relationOptionsConfig as FormArray;
  }
  get symbolOptionsConfig() {
    return this.form.controls.symbolOptionsConfig as FormArray;
  }
  get computeOptionsConfig() {
    return this.form.controls.computeOptionsConfig as FormArray;
  }
  get changeValueOptionsConfig() {
    return this.form.controls.changeValueOptionsConfig as FormArray;
  }
  get updateValueOptionsConfig() {
    return this.form.controls.updateValueOptionsConfig as FormArray;
  }
  //#endregion

  add(type) {
    console.log(this[this.cascadeMapping[type]])
    this[this.cascadeMapping[type]].push(this.createUser(type));
    this.edit(type, this[this.cascadeMapping[type]].length - 1);
    // this.ajaxOptionsConfig.push(this.createUser(type));
    // this.edit(this.ajaxOptionsConfig.length - 1);
  }

  del(type: string, index: number) {
    this[this.cascadeMapping[type]].removeAt(index);
    // this.ajaxOptionsConfig.removeAt(index);
  }

  edit(type: string, index: number) {
    if (this.editIndex !== -1 && this.editObj) {
      this[this.cascadeMapping[type]].at(this.editIndex).patchValue(this.editObj);
      // this.ajaxOptionsConfig.at(this.editIndex).patchValue(this.editObj);
    }
    this.editObj = { ...this[this.cascadeMapping[type]].at(index).value };
    this.editIndex = index;
  }

  save(type: string, index: number) {
    this[this.cascadeMapping[type]].at(index).markAsDirty();
    if (this[this.cascadeMapping[type]].at(index).invalid) { return; }
    // this.ajaxOptionsConfig.at(index).markAsDirty();
    // if (this.ajaxOptionsConfig.at(index).invalid) { return; }
    this.editIndex = -1;
  }

  cancel(type: string, index: number) {
    if (!this[this.cascadeMapping[type]].at(index).value.key) {
      this.del(type, index);
    } else {
      this[this.cascadeMapping[type]].at(index).patchValue(this.editObj);
    }
    // if (!this.ajaxOptionsConfig.at(index).value.key) {
    //   this.del(type, index);
    // } else {
    //   this.ajaxOptionsConfig.at(index).patchValue(this.editObj);
    // }
    this.editIndex = -1;
  }

  addsymbol() {
    this.symbolOptionsConfig.push(this.createSymbolParams());
    this.editsymbol(this.symbolOptionsConfig.length - 1);
  }

  delsymbol(index: number) {
    this.symbolOptionsConfig.removeAt(index);
  }

  editsymbol(index: number) {
    if (this.editParamsIndex !== -1 && this.editObj) {
      this.symbolOptionsConfig.at(this.editParamsIndex).patchValue(this.editObj);
    }
    this.editObj = { ...this.symbolOptionsConfig.at(index).value };
    this.editParamsIndex = index;
  }

  savesymbol(index: number) {
    this.symbolOptionsConfig.at(index).markAsDirty();
    if (this.symbolOptionsConfig.at(index).invalid) { return; }
    this.editParamsIndex = -1;
  }

  cancelsymbol(index: number) {
    if (!this.symbolOptionsConfig.at(index).value.key) {
      this.delsymbol(index);
    } else {
      this.symbolOptionsConfig.at(index).patchValue(this.editObj);
    }
    this.editParamsIndex = -1;
  }

  /**
   * 动态生成表数据
   */
  public createSymbol() {
    if (this.symbolMapping.length > 0) {

    } else {
      this.symbolList.forEach(i => {
        const field = this.createSymbolParams();
        field.patchValue(i);
        this.symbolOptionsConfig.push(field);
        this.symbolMapping.push({
          key: i['key'],
          isCreate: true
        });
        // this.ajaxOptionsConfig.push(field);
      });


    }
  }
  handleOk() {
    this.isVisible = true;
  }

  handleCancel() {
    this.isVisible = false;
  }

  createSymbolParams(): FormGroup {
    return this.fb.group({
      key: [null],
      type1: [null, [Validators.required]],
      valueName1: [null, [Validators.required]],
      valueName2: [null, [Validators.required]],
      type2: [null, [Validators.required]],
      name: [null, [Validators.required]],
    });
  }

  setsymbol(i) {
    this.isVisible = true;
  }

  _submitForm() {
    // console.log('准备开始生成结构');
    const formValue = this.form.value;
    const cascadeType = this.rowData['receiverRelationName'];
    let caseValue: any; // 条件触发的配置
    let content: any; // 级联内容配置
    if (formValue['TriggerType'] === 'condition') {
      caseValue = this.assembleCondition(formValue.ParamsCondition, formValue.ParamsName, formValue.ParamsType);
    } else {
      caseValue = {};
    }
    content = {
      "type": cascadeType,
      "data": {
        "option": this.assembleContent(formValue, cascadeType)
      }
    }

    // 级联发出消息组装特殊结构
    if (cascadeType === 'relation') {
      content['content'] = {
        "type": "relation",
        "sender": {
          "name": "validation",
          "message": "message.ajax.state.success",
          "senderId": formValue.SendMessageId
        }
      }
    }

    // 级联计算组装特殊结构
    const expressionArray = [];
    if (cascadeType === 'compute') {
      content['compute'] = {
        "type": "compute",
        "expression": expressionArray
      }
    }
    // console.log('formValue', formValue);
    this.cascadeValueObject =
    {
      "type": formValue['TriggerType'],
      "caseValue": caseValue,
      "content": content
    }
    this.valuChange(this.cascadeValueObject);
  }

  /**
   * assembleCondition 组装条件对象
   */
  public assembleCondition(condition, paramsName, paramsType) {
    const options: any = {
      "type": paramsType,
      "valueName": paramsName,
      "regular": condition,
      "value": ""
    }
    return { caseValue: options };
  }

  /**
   * assembleContent 组装级联内容
   */
  public assembleContent(formValue, type) {
    let contentItems: any = [];
    if (formValue[this.cascadeMapping[type]].length > 0) {
      formValue[this.cascadeMapping[type]].forEach(item => {
        const itemCopy = JSON.parse(JSON.stringify(item));
        delete itemCopy.key
        contentItems.push(itemCopy);
      });
    }
    return contentItems;
  }

  public valuChange($v?) {
    const backValue = { name: 'cascadeObject', value: this.cascadeValueObject, Id: this.rowData.key };
    // console.log('backValue', backValue);
    this.updateValue.emit(backValue);
  }

}
