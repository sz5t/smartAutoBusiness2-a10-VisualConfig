import { Component, OnInit, Output, EventEmitter, Input, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { BSN_COMPONENT_SERVICES } from 'src/app/core/relations/bsn-relatives';
import { ComponentServiceProvider } from 'src/app/core/services/components/component.service';
import { CnComponentBase } from '../../../cn-component.base';

@Component({
  selector: 'app-cfg-attribute-assemble-resource-select',
  templateUrl: './cfg-attribute-assemble-resource-select.component.html',
  styles: [
  ]
})
export class CfgAttributeAssembleResourceSelectComponent extends CnComponentBase implements OnInit {
  @Input() public config;
  @Output() public updateValue = new EventEmitter();

  headParamsEditIndex = -1;
  pathParamsEditIndex = -1;
  queryParamsEditIndex = -1;
  bodyParamsEditIndex = -1;
  paramsEditIndex = -1;

  editObj = {};
  isVisible = false;

  subParams = false;

  showSelectResource = false;

  resourceType: any;

  form: FormGroup;


  public editIndexMapping: any = {
    headParams: 'headParamsEditIndex',
    pathParams: 'pathParamsEditIndex',
    queryParams: 'queryParamsEditIndex',
    bodyParams: 'bodyParamsEditIndex',
    params: 'paramsEditIndex',
  }

  public ajaxSateMapping: any[] = [];

  public symbolMapping: any[] = [];

  // public cascadeValue: any = {};

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

  constructor(
    @Inject(BSN_COMPONENT_SERVICES)
    public componentService: ComponentServiceProvider,
    private fb: FormBuilder
  ) { super(componentService); }

  ngOnInit() {
    this.form = this.fb.group({
      Id: [undefined, [Validators.required]],
      urlType: [null, [Validators.required]],
      isUrlContent: [null, [Validators.required]],
      outterUrlName: [null],
      outterUrlTitle: [null],
      ResourceType: [null, [Validators.required]],
      innerUrl: [null, [Validators.required]],
      ResourceOperateType: [null, [Validators.required]],
      innerAjaxType: [null, [Validators.required]],
      isAdditionalParams: [null, [Validators.required]],
      isHeadParams: [null],
      isPathParams: [null],
      isQueryParams: [null],
      isBodyParams: [null],
      headParams: this.fb.array([]),
      pathParams: this.fb.array([]),
      queryParams: this.fb.array([]),
      bodyParams: this.fb.array([]),
      params: this.fb.array([]),
    });
    // console.log('rowdata', this.rowData);
    this.loadParamsData();
  }

  public ngAfterViewInit() {
  }

  public setValue(data?) {
    this.updateValue.emit(data);
  }

  /**
   * loadParamsData 读取参数
   */
  public async loadParamsData() {
    await this.load_data();
    this.createTableData();
  }

  /**
   * load_data 读取需要的数据
   */
  public async load_data() {
    // if (this.config.cascadeDataListConfig && this.config.cascadeDataListConfig.hasOwnProperty(this.cascadeDataMapping[cascadeType])) {
    //   const sendPanelConfig = this.assembleAjax(this.config.cascadeDataListConfig[this.cascadeDataMapping[cascadeType]]);
    //   if (sendPanelConfig['id']) {
    //     const sendData = await this.getData(sendPanelConfig);
    //     if (sendData.data.length > 0) {
    //       this[this.cascadeDataMapping[cascadeType]] = sendData.data;
    //       this.userList = this[this.cascadeDataMapping[cascadeType]]
    //     }
    //   }
    // }
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
    if (this.ajaxSateMapping.findIndex(e => e['type'] === type) > -1) {

    } else {
      this.userList.forEach(i => {
        const field = this.createUser();
        if (field) {
          field.patchValue(i);
          this['headParams'].push(field); // 先不写读取数据的资源，确定个表结构之后需要修改
          this.ajaxSateMapping.push({
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
      key: [null],
      type: [null, [Validators.required]],
      valueName: [null, [Validators.required]],
      conditionType: [null],
      value: [null],
      name: [null, [Validators.required]],
    });
  }

  /**
   * responseModeValueChange 级联方式值改变回调
   */
  public responseModeValueChange($event) {
    this.createTableData($event);
  }

  //#region get form fields
  get Id() {
    return this.form.controls.Id.value;
  }
  get urlType() {
    return this.form.controls.urlType.value;
  }
  get isUrlContent() {
    return this.form.controls.isUrlContent.value;
  }
  get outterUrlName() {
    return this.form.controls.outterUrlName.value;
  }
  get outterUrlTitle() {
    return this.form.controls.outterUrlTitle.value;
  }
  get ResourceType() {
    return this.form.controls.ResourceType.value;
  }
  get innerUrl() {
    return this.form.controls.innerUrl.value;
  }
  get ResourceOperateType() {
    return this.form.controls.ResourceOperateType.value;
  }
  get innerAjaxType() {
    return this.form.controls.innerAjaxType.value;
  }
  get isAdditionalParams() {
    return this.form.controls.isAdditionalParams.value;
  }
  get isHeadParams() {
    return this.form.controls.isHeadParams.value;
  }
  get isPathParams() {
    return this.form.controls.isPathParams.value;
  }
  get isQueryParams() {
    return this.form.controls.isQueryParams.value;
  }
  get isBodyParams() {
    return this.form.controls.isBodyParams.value;
  }
  get headParams() {
    return this.form.controls.headParams as FormArray;
  }
  get pathParams() {
    return this.form.controls.pathParams as FormArray;
  }
  get queryParams() {
    return this.form.controls.queryParams as FormArray;
  }
  get bodyParams() {
    return this.form.controls.bodyParams as FormArray;
  }
  get params() {
    return this.form.controls.params as FormArray;
  }
  //#endregion

  changeParams($event) {
    this.subParams = $event;
  }

  changeResourceType() {
    // console.log(this.form.value.ResourceType);
    this.resourceType = this.form.value.ResourceType;
  }

  selectResource() {
    this.showSelectResource = true;
  }

  add(type) {
    // console.log(type);
    this[type].push(this.createUser());
    this.edit(type, this[type].length - 1);
    // this.ajaxOptionsConfig.push(this.createUser(type));
    // this.edit(this.ajaxOptionsConfig.length - 1);
  }

  del(type: string, index: number) {
    this[type].removeAt(index);
    // this.ajaxOptionsConfig.removeAt(index);
  }

  edit(type: string, index: number) {
    if (this[this.editIndexMapping[type]] !== -1 && this.editObj) {
      this[type].at(this[this.editIndexMapping[type]]).patchValue(this.editObj);
      // this.ajaxOptionsConfig.at(this[this.editIndexMapping[type]]).patchValue(this.editObj);
    }
    this.editObj = { ...this[type].at(index).value };
    this[this.editIndexMapping[type]] = index;
  }

  save(type: string, index: number) {
    this[type].at(index).markAsDirty();
    if (this[type].at(index).invalid) { return; }
    // this.ajaxOptionsConfig.at(index).markAsDirty();
    // if (this.ajaxOptionsConfig.at(index).invalid) { return; }
    this[this.editIndexMapping[type]] = -1;
  }

  cancel(type: string, index: number) {
    if (!this[type].at(index).value.key) {
      this.del(type, index);
    } else {
      this[type].at(index).patchValue(this.editObj);
    }
    // if (!this.ajaxOptionsConfig.at(index).value.key) {
    //   this.del(type, index);
    // } else {
    //   this.ajaxOptionsConfig.at(index).patchValue(this.editObj);
    // }
    this[this.editIndexMapping[type]] = -1;
  }
  handleOk() {
    this.isVisible = true;
  }

  handleCancel() {
    this.isVisible = false;
  }

  setsymbol(i) {
    this.isVisible = true;
  }

  _submitForm() {
    let ajaxConfig: any = {};
    // console.log('准备开始生成结构');
    const formValue = this.form.value;
    // console.log('formValue', formValue);
    // this.valuChange(this.cascadeValue);
    const essentialInfo = this.assembleEssentialInfo(formValue);
    ajaxConfig = { ...ajaxConfig, ...essentialInfo }
    const essentialParams = this.assembleParamsInfo(formValue);
    ajaxConfig = { ...ajaxConfig, ...essentialParams }
    // console.log('ajaxConfig', ajaxConfig);
  }

  /**
   * assembleEssentialInfo
   */
  public assembleEssentialInfo(formValue) {
    let essentialInfo: any = {}
    if (formValue.isUrlContent) {
      essentialInfo = {
        id: formValue.Id,
        urlType: formValue.urlType,
        urlContent: {
          name: formValue.outterUrlName,
          title: formValue.outterUrlTitle
        },
        url: this.assembleUrl(formValue),
        ajaxType: formValue.innerAjaxType,
      }
    } else {
      essentialInfo = {
        id: formValue.Id,
        urlType: formValue.urlType,
        url: this.assembleUrl(formValue),
        ajaxType: formValue.innerAjaxType,
      }
    }
    return essentialInfo;
  }

  /**
   * assembleParamsInfo
   */
  public assembleUrl(formValue) {
    let ResourceType: any = 'resource';
    if (formValue.ResourceType === 'cfgBusiModel') {
      ResourceType = 'cfgBusiModel'
    }
    return ResourceType + '/' + formValue.innerUrl + '/' + formValue.ResourceOperateType;
  }

  /**
   * assembleParamsInfo
   */
  public assembleParamsInfo(formValue) {
    const paramsInfo = {
      headParams: this.assembleParams(formValue['headParams']),
      pathParams: this.assembleParams(formValue['pathParams']),
      queryParams: this.assembleParams(formValue['queryParams']),
      bodyParams: this.assembleParams(formValue['bodyParams']),
      params: this.assembleParams(formValue['params'])
    }
    return paramsInfo;
  }

  /**
   * assembleParams 对填写的数据源进行加工
   */
  public assembleParams(array) {
    if (array.length > 0) {
      array.forEach(element => {
        delete element['key']
      });
    }
    return array;
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
    if (formValue[type].length > 0) {
      formValue[type].forEach(item => {
        const itemCopy = JSON.parse(JSON.stringify(item));
        delete itemCopy.key
        contentItems.push(itemCopy);
      });
    }
    return contentItems;
  }

  public valuChange($v?) {
    // const backValue = { name: 'cascadeObject', value: this.cascadeValue, Id: this.rowData.key };
    // console.log('backValue', backValue);
    // this.updateValue.emit(backValue);
  }

}
