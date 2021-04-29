import { Component, OnInit, Output, EventEmitter, Input, Inject, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { Subject, Subscription } from 'rxjs';
import { CN_CONTAINERS_METHOD } from 'src/app/core/relations/bsn-methods/containers-methods';
import { CN_CONTAINERS_PROPERTY } from 'src/app/core/relations/bsn-property/containers.property.interface';
import { BSN_COMPONENT_SERVICES } from 'src/app/core/relations/bsn-relatives';
import { ComponentServiceProvider } from 'src/app/core/services/components/component.service';
import { RelationResolver } from 'src/app/shared/resolver/relation/relation.resolver';
import { CnComponentBase } from '../../../cn-component.base';
import { CnPageComponent } from '../../../cn-page/cn-page.component';
import { CommonUtils } from 'src/app/core/utils/common-utils';

@Component({
  selector: 'app-cfg-attribute-validation',
  templateUrl: './cfg-attribute-validation.component.html',
  styles: [
  ]
})
export class CfgAttributeValidationComponent extends CnComponentBase implements OnInit {

  formValueCache: { [key: string]: { data: any } } = {};

  @Input() public config;
  @Output() public updateValue = new EventEmitter();

  headParamsEditIndex = -1;
  pathParamsEditIndex = -1;
  queryParamsEditIndex = -1;
  bodyParamsEditIndex = -1;
  paramsEditIndex = -1;

  public ajaxList: any = [];

  public columnsParams: any = [];

  public ajaxParams: any = [];

  public columnsParamsTemp: any = [];

  editObj = {};
  isVisible = false;

  subParams = false;

  showSelectResource = false;

  resourceType: any;

  form: FormGroup;

  windowDialog: any;

  innerUrl: any = '';

  public COMPONENT_METHODS = CN_CONTAINERS_METHOD;

  public COMPONENT_PROPERTY = CN_CONTAINERS_PROPERTY;

  private _sender_source$: Subject<any>;
  private _trigger_source$: Subject<any>;

  private _receiver_subscription$: Subscription;
  private _sender_subscription$: Subscription;
  private _trigger_receiver_subscription$: Subscription;


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
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef
  ) { super(componentService); }

  ngOnInit() {
    // console.log('rowdata', this.rowData);
    this.initForm();
    this._initInnerValue();
    this.loadParamsData();
    this.resolveRelations();
  }

  public ngAfterViewInit() {
  }

  public setValue(data?) {
    this.updateValue.emit(data);
  }

  public initForm() {
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
  }

  /**
   * loadParamsData 读取参数
   */
  public async loadParamsData() {
    await this.load_data();
    this.createTableData();
  }

  private _initInnerValue() {
    this.tempValue = {};
    this.initValue = {};
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
    return CommonUtils.uuID(36);
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
  // get innerUrl() {
  //   return this.form.controls.innerUrl.value;
  // }
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
    let dialog;
    // 根据按钮类型初始化表单状态
    const dialogCfg = this.config.window[0];

    const dialogOptional = {
      nzTitle: dialogCfg.title ? dialogCfg.title : '',
      nzWidth: dialogCfg.width ? dialogCfg.width : '600px',
      nzStyle: dialogCfg.style ? dialogCfg.style : null, // style{top:'1px'},
      nzMaskClosable: dialogCfg.hasOwnProperty('maskClosable') ? dialogCfg.maskClosable : false,
      nzContent: CnPageComponent,
      nzComponentParams: {
        config: {},
        customPageId: dialogCfg.layoutName, // "0MwdEVnpL0PPFnGISDWYdkovXiQ2cIOG",
        initData: { 'resourceType': this.form.value.ResourceType }
        // changeValue: [{ 'resourceType': this.form.value.ResourceType }],
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
          },
        },
      ],
    };
    // 自定义 操作按钮
    if (dialogCfg.footerButton && dialogCfg.footerButton.length > 0) {
      dialogOptional.nzFooter = [];

      dialogCfg.footerButton.forEach((_button) => {
        dialogOptional.nzFooter.push({
          label: _button.text,
          onClick: (componentInstance) => {
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

  public execCustomAction(customAction?, dialog?, componentInstance?) {
    // console.log('execCustomAction');

    customAction.execute.forEach((item) => {
      if (item.type === 'relation') {
        new RelationResolver(this).resolveInnerSender(item.sender, {}, Array.isArray({}));
      } else if (item.type === 'action') {
        this.windowDialog.close();
        this.windowDialog = null;
      }
    });

    // new RelationResolver(this). resolveSender();

    return true;
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

  deleteRow(id: string): void {
    this.ajaxList = this.ajaxList.filter(d => d['AjaxId'] !== id);
  }

  handleCancel(): void {
    this.isVisible = false;
  }

  setSymbol(i?) {
    this.isVisible = true;
    this.form.reset();
  }

  async _submitForm() {
    let ajaxConfig: any = {};
    // console.log('准备开始生成结构');
    const formValue = this.form.value;
    formValue.Id = CommonUtils.uuID(36);
    console.log('formValue', formValue);
    const ajaxIndex = this.ajaxList.findIndex(e => e['AjaxId'] === formValue.Id)
    if (ajaxIndex === -1) {
      this.ajaxList.push({ AjaxId: formValue.Id, resoureceName: formValue.innerUrl });
    }
    this.formValueCache = { ...this.formValueCache, ...{ [formValue.Id]: formValue } }

    const params = await this._executeAjax(this.tempValue['resourceId']);

    if (params.data.length > 0) {
      params.data.forEach(param => {
        this.columnsParamsTemp.push({
          id: param.id,
          name: param.paramName,
          datatype: param.datatype,
          descName: param.descName
        })
      });
    }

    this.columnsParams.push(
      {
        id: formValue.Id,
        columnsParams: this.columnsParamsTemp.length > 0 ? this.columnsParamsTemp : [],
        ajaxParams: {
          headParams: formValue.headParams,
          pathParams: formValue.pathParams,
          queryParams: formValue.queryParams,
          bodyParams: formValue.bodyParams,
          params: formValue.params
        }
      }
    )
    // console.log('columnsParams', this.columnsParamsTemp);
    // this.valuChange(this.cascadeValue);
    const essentialInfo = this.assembleEssentialInfo(formValue);
    ajaxConfig = { ...ajaxConfig, ...essentialInfo }
    const essentialParams = this.assembleParamsInfo(formValue);
    ajaxConfig = { ...ajaxConfig, ...essentialParams }
    // console.log('ajaxConfig', ajaxConfig);
    this.ajaxParams.push(ajaxConfig);
    this.handleCancel();
  }

  _resetForm(): void {
    this.form.reset();
  }

  private async _executeAjax(resourceId) {
    const url = 'resource/GET_DM_COLUMNS_LIST/query';
    const method = 'get';
    const response = await this.executeHttpRequest(url, method, { 'resourceId': resourceId, '_mapToObject': true });
    return response;
  }

  submitAjax() {
    const ajaxObj = {
      ajaxConfig: this.ajaxParams,
      ajaxDesc: this.columnsParams
    }
    console.log(ajaxObj);
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

  public transferValue(option?) {
    // console.log('将接受传递的值', this.tempValue);
    this.innerUrl = this.tempValue['resourceName'];
    this.cdr.markForCheck();
  }

  private resolveRelations() {
    if (this.config.cascade && this.config.cascade.messageSender) {
      if (!this._sender_source$) {
        // 解析组件发送消息配置,并注册消息发送对象
        this._sender_source$ = new RelationResolver(this).resolveSender(this.config);
        this._sender_subscription$ = this._sender_source$.subscribe();
      }
    }
    if (this.config.cascade && this.config.cascade.messageReceiver) {
      // 解析消息接受配置,并注册消息接收对象
      // this._receiver_source$ = new RelationResolver(this).resolveReceiver(this.config);
      // this._receiver_subscription$ = this._receiver_source$.subscribe();
      new RelationResolver(this).resolveReceiver(this.config);
    }

    this._trigger_source$ = new RelationResolver(this).resolve();
  }

  public getCurrentComponentId() {
    return this.config.id;
  }

  public valuChange($v?) {
    // const backValue = { name: 'cascadeObject', value: this.cascadeValue, Id: this.rowData.key };
    // console.log('backValue', backValue);
    // this.updateValue.emit(backValue);
  }

}
