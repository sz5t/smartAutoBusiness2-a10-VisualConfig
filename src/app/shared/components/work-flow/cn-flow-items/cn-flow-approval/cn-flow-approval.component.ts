import { formatDate } from '@angular/common';
import { Component, ComponentFactoryResolver, ComponentRef, Inject, Input, OnInit, Type, ViewChild, ViewContainerRef } from '@angular/core';
import { dotCase } from '@antv/x6/lib/util/string/format';
import { worker } from 'cluster';
import { Subject, Subscription } from 'rxjs';
import { CN_FLOW_PREVIEW_METHOD } from 'src/app/core/relations/bsn-methods/bsn-flow-preview-methods';
import { CN_FLOW_PREVIEW_PROPERTY } from 'src/app/core/relations/bsn-property/data-flow-preview.property.interface';
import { BSN_COMPONENT_SERVICES } from 'src/app/core/relations/bsn-relatives';
import { ComponentServiceProvider } from 'src/app/core/services/components/component.service';
import { ParameterResolver } from 'src/app/shared/resolver/parameter/parameter.resolver';
import { RelationResolver } from 'src/app/shared/resolver/relation/relation.resolver';
import { CnComponentBase } from '../../../cn-component.base';
import { CnPageComponent } from '../../../cn-page/cn-page.component';
import { CnDataFormComponent } from '../../../data-form/cn-data-form.component';
const components: { [type: string]: Type<any> } = {
  page: CnPageComponent,
  form: CnDataFormComponent
};
@Component({
  selector: 'app-cn-flow-approval,[cn-flow-approval]',
  templateUrl: './cn-flow-approval.component.html',
  styles: [
    `.toolbarGroup {
      margin-right:10px;
      float:right;
    }
    .toolbarGroupbutton {
      margin-right:3px;
     
    }
    .table-operations {
      padding-top: 3px;
      padding-bottom: 3px;
   }

   .table-operations .ant-btn-group {
       margin-right: 4px;
       margin-bottom: 2px;
       font-weight: 600;
   }

    `
  ]
})
export class CnFlowApprovalComponent extends CnComponentBase implements OnInit {
  @Input() public config;
  @Input() public changeValue;
  @Input() public tempData;
  @Input() public initData;
  @Input() public dialog;


  // @ViewChild('approvalpage', { static: true }) public approvalpage: CnPageComponent;
  private _componentRef: ComponentRef<any>;
  tableConfig;
  page_config: any;
  page1: CnPageComponent;
  @ViewChild('virtualContainer', { static: true, read: ViewContainerRef }) virtualContainer: ViewContainerRef;


  public COMPONENT_NAME = 'CnFlowPreview';
  /**
   * ????????????????????????
   * ???????????????????????????
   */
  public COMPONENT_METHODS = CN_FLOW_PREVIEW_METHOD;

  public COMPONENT_PROPERTY = CN_FLOW_PREVIEW_PROPERTY;
  public FORM_VALUE: any = {}; // ?????????????????????
  public FORM_STATE: any; // ???????????????=???????????????????????????
  public FORM_VALID: any;
  private _sender_source$: Subject<any>;
  private _receiver_source$: Subject<any>;
  private _trigger_source$: Subject<any>;

  private _receiver_subscription$: Subscription;
  private _sender_subscription$: Subscription;
  private _trigger_receiver_subscription$: Subscription;
  constructor(@Inject(BSN_COMPONENT_SERVICES)
  public componentService: ComponentServiceProvider, private _resolver: ComponentFactoryResolver,) {
    super(componentService);
  }


  public modelstyle = {
    width: '100%',
    'min-height': (window.document.body.clientHeight - 170).toString() + 'px',
    height: (window.document.body.clientHeight - 170).toString() + 'px',
  };
  async ngOnInit(): Promise<void> {

    if (this.initData) {
      this.initValue = this.initData;
    } else {
      this.initValue = {};
    }
    if (this.tempData) {
      this.tempValue = this.tempData;
    } else {
      this.tempValue = {};
    }
    this.setChangeValue(this.changeValue);
    if (!this.config) {
      this.config = {};
    }
    if (this.tempValue['PAGE_ID']) {
      let aa_page = JSON.parse(this.tempValue['PAGE_ID']);
      this.a_page = aa_page;
      this.config['layoutName'] = this.a_page.approval.layoutName;
      console.log('xxxx', this.tempValue['PAGE_ID'], aa_page)
    } else {
      this.config['layoutName'] = this.a_page.approval.layoutName;//"52sFEpgUYV1u7KVU4VI0PwST0ZFeWknEcNCb";
    }

    this.config['id'] = 'liu';
    let b_page = "@start:page/52sFEpgUYV1u7KVU4VI0PwST0ZFeWknEcNCb/componentid@approval:page/52sFEpgUYV1u7KVU4VI0PwST0ZFeWknEcNCb/componentid"; //??????????????????

    await this.getJson();
    this.resolveRelations();

    await this.load();
  }

  async getJson() {
    if (!this.tableConfig) {
      if (this.config.layoutName) {
        // liu 20.11.12
        this.tableConfig = this.getMenuComponentConfigById(this.config.layoutName);
        // this.tableConfig = this.componentService.cacheService.getNone(this.config.layoutName);
      }
      if (!this.tableConfig) {
        await this.getCustomConfig(this.config.layoutName);

        this.tableConfig = this.getMenuComponentConfigById(this.config.layoutName);
        // this.tableConfig = this.componentService.cacheService.getNone(this.config.layoutName);
      }
      // this.loading = false;
      this._buildComponent();
    } else {
      // this.buildChangeValue(this.config);
    }
  }

  private _buildComponent(componentObj?) {
    // console.log('=+++++=====++++++======+++',this.tableConfig,this.config.layoutName)
    if (!this.tableConfig) {
      return false;
    }
    const comp = this._resolver.resolveComponentFactory<any>(components.page);
    this.virtualContainer.clear();
    this._componentRef = this.virtualContainer.createComponent(comp);
    this._componentRef.instance.config = this.tableConfig;
    this._componentRef.instance.customPageId = this.config['layoutName'];
    this._componentRef.instance.changeValue = [
      {

        name: '$WF_BusinessId',
        type: 'value',
        value: this.$businessId,
        valueTo: 'tempValue'
      }
    ];//this._changeValue;



    // this._componentRef.instance.updateValue.subscribe((event) => {
    //   this.valueChange1(event);
    // });
    this.page1 = this._componentRef.instance;

    // this.buildChangeValue(this.config);
  }
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
  public getCurrentComponentId() {
    return this.config['id'];
  }

  async load() {
    await this.getData();
  }


  config1 = {
    panels: [
      {
        "id": "panel_bese",
        active: true,
        disabled: false,
        hidden: false,
        name: '????????????',
        component: {
          "id": "form_bese",
          "type": "default"
        }
      },
      {
        "id": "panel_business",
        active: true,
        disabled: false,
        hidden: false,
        name: '????????????',
        component: {
          "id": "form_business",
          "type": "default"
        }
      }
    ]
  }

  listOfData = [
    {
      key: '1',
      name: 'John Brown',
      age: 32,
      address: 'New York No. 1 Lake Park'
    },
    {
      key: '2',
      name: 'Jim Green',
      age: 42,
      address: 'London No. 1 Lake Park'
    },
    {
      key: '3',
      name: 'Joe Black',
      age: 32,
      address: 'Sidney No. 1 Lake Park'
    }
  ];


  public add() {

    this.listOfData.push({
      key: '1',
      name: 'John Brown',
      age: 32,
      address: 'New York No. 1 Lake Park'
    });
    this.listOfData = this.listOfData.filter(i => i.key !== '');

    console.log('add')

  }


  // ???????????????page_componentId???=> 

  /*
   
    ????????????:???????????????????????????????????????
    ??????????????????
     ?????????????????????????????????????????????????????????????????? ?????? 

     pageId \52sFEpgUYV1u7KVU4VI0PwST0ZFeWknEcNCb\

     ????????????=????????????????????????????????????



   */


  public setPage() {
    let d = {
      nzContent: CnPageComponent,
      nzComponentParams: {
        config: {},
        customPageId: "layoutName", // "0MwdEVnpL0PPFnGISDWYdkovXiQ2cIOG",
        changeValue: [],
      }
    }
  }
  a_page = {
    start: { // ??????????????????
      type: 'page',  // page/form  
      layoutName: "52sFEpgUYV1u7KVU4VI0PwST0ZFeWknEcNCb",
      tagComponent: {
        tagComponentId: "system_user_table1",  // ????????????
        tagComponentWhere: {  // ? ???????????????????????????????????????????????????????????? ??????????????????parems
          params: [
            {
              name: "",
              value: ""
            }
          ]
        },
        tagValue: {
          "businessData": "ROW_SELECTED",// ??????????????????
          "businessId": "ID"
        }
      }

    },
    approval: {  // ????????????????????????????????????????????????????????????
      layoutName: "PDj8QiHHCu3EpGxoZeCezQ5cLY04XiPG4k0M",
      tagComponent: {
        tagComponentId: "form_01",  // ????????????
        tagComWhere: { // ? ???????????????????????????????????????????????????????????? ??????????????????parems
          params: [{
            name: ""
          }]
        }
      }
    }
  }

  dd = {
    "start": {
      "type": 'page',
      "layoutName": "52sFEpgUYV1u7KVU4VI0PwST0ZFeWknEcNCb",
      "tagComponent": {
        "tagComponentId": "system_user_table1",
        "tagComponentWhere": {
          "params": [
            {
              "name": "",
              "value": ""
            }
          ]
        },
        "tagValue": {
          "businessData": "ROW_SELECTED",
          "businessId": "ID"
        }
      }

    },
    "approval": {
      "layoutName": "52sFEpgUYV1u7KVU4VI0PwST0ZFeWknEcNCb",
      "tagComponent": {
        "tagComponentId": "comid",
        "tagComWhere": {
          "params": [
            {
              "name": ""
            }]
        }
      }
    }
  }
  test_satrt() {
    // a_page
    console.log('???????????????:', this.a_page);
    let com_instance = this.page1.componentDataService.componentInstance;

    let comptId = this.a_page['start']['tagComponent']['tagComponentId'];
    let tag_businessData = this.a_page['start']['tagComponent']['tagValue']['businessData'];
    let tag_businessId = this.a_page['start']['tagComponent']['tagValue']['businessId'];
    let c_instance = this.page1.componentDataService.componentInstance[comptId];
    let c_businessData = c_instance.instance[tag_businessData];
    let c_businessId = c_businessData[tag_businessId];

    console.log('??????????????????:', c_businessData, "??????????????????id:", c_businessId, this.tempValue);
  }

  public setTest() {
    this.page1.test_get();
  }

  public satrt() {

    //     http://192.168.1.111:8405/process/instance/start
    // POST
    // {
    // 	"code":"", -- ??????code
    // 	"userId":"", -- ???????????????id
    // 	"businessId":"", -- ?????????????????????id
    // 	"businessData":{ -- ?????????????????????json??????(?????????????????????, global??????)
    // 		"key":"value",
    // 		...
    // 	}
    // }
    let satrt_config = {
      "id": "satrt_ajax",
      "enableAjaxMore": true,
      "url": "http://192.168.1.111:8405/process/instance/start",
      "urlType": "inner",
      "ajaxType": "post",
      "headParams": [],
      "pathParams": [],
      "queryParams": [],
      "bodyParams": [
        {
          "name": "code",
          "type": "value",
          "valueName": "test01",
          "value": "test01"
        },
        {
          "name": "version",
          "type": "value",
          "valueName": "test01",
          "value": "test01"
        },
        {
          "name": "userId",
          "type": "value",
          "valueName": "admin",
          "value": "Z5TiQPHxZ1LJQwkQLK7f7nSKQXC7dbVJJTOh"
        },
        {
          "name": "businessId",
          "type": "value",
          "valueName": "image",
          "value": "hnfOwehxzAtjyDKBNLcjmWMVcjO3qLwM4gGB"
        },
        {
          "name": "businessData",
          "type": "value",
          "valueName": "image",
          "value": {
            "ID": "hnfOwehxzAtjyDKBNLcjmWMVcjO3qLwM4gGB",
            "RN": 1,
            "SIR_CODE": "002",
            "SIR_DESC": "?????????",
            "SIR_MARK": "??????",
            "SIR_NAME": "?????????",
            "SIR_STATE": 1,
            "SIR_STATE_TEXT": "?????????"
          }
        }

      ],
      "enableResultData": false,
      "outputParameters": [],
      "result1": [
        {
          "name": "data",
          "showMessageWithNext": 0,
          "message": "message.ajax.state.success",
          "senderId": "aftetFuncSaveSuccessfully"
        }
      ]
    }

    this.executeModal(satrt_config);

  }



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

  public buildParameters(paramsCfg, itemData?, isArray = false) {
    return ParameterResolver.resolve({
      params: paramsCfg,
      tempValue: this.tempValue,
      componentValue: {},//this.getComponentValueNew(),
      initValue: this.initValue,
      cacheValue: this.cacheValue,
      router: this.routerValue,
      returnValue: itemData ? itemData : {},
      item: itemData ? itemData : {},
      userValue: this.userValue,
      selectedRow: {} // this.selectedRow
    });
  }

  public async executeModal(execConfig) {


    console.log('-------------??????sql', execConfig);
    // ??????????????????
    // ??????????????????
    // this.componentService.apiService.doPost();
    const url = execConfig.url;
    const params = this.buildParameters(execConfig.params);
    //  console.log(this.config.id + '-------------??????sql params:', params);
    const back = false;

    let response: any;
    if (execConfig['enableAjaxMore']) {
      response = await this.executeHttpMore(execConfig, {}, 'buildParameters', null);
    } else {
      response = await this.componentService.apiService[execConfig.ajaxType](url, params).toPromise();
    }
    // ??????????????????,??????????????????????????????????????????,???????????????????????????????????? {}
    this._sendDataSuccessMessage(response, execConfig.result);

    // ??????validation??????
    const validationResult = this._sendDataValidationMessage(response, execConfig.result);

    // ??????error??????
    const errorResult = this._sendDataErrorMessage(response, execConfig.result);

    return validationResult && errorResult;

  }

  public async executeModalBack(execConfig, itemData?) {


    console.log('-------------??????sql', execConfig);
    // ??????????????????
    // ??????????????????
    // this.componentService.apiService.doPost();
    const url = execConfig.url;
    const params = this.buildParameters(execConfig.params);
    //  console.log(this.config.id + '-------------??????sql params:', params);
    const back = false;

    let response: any;
    if (execConfig['enableAjaxMore']) {
      response = await this.executeHttpMore(execConfig, itemData, 'buildParameters', null);
    } else {
      response = await this.componentService.apiService[execConfig.ajaxType](url, params).toPromise();
    }


    return response;

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
  /**
* ???????????????
* @param option
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

  buttonGroups: any = [];
  activeMode: any = "";
  $businessId: any;
  public async getData() {
    // http://192.168.1.111:8405/task/enter/{taskinstId}/{userId} 

    let satrt_config = {
      "id": "satrt_ajax",
      "enableAjaxMore": true,
      "url": "http://192.168.1.111:8405/task/enter/{taskinstId}/{userId}",
      "urlType": "inner",
      "ajaxType": "get",
      "headParams": [],
      "pathParams": [
        {
          "name": "taskinstId",
          "type": "tempValue",
          "valueName": "ID",
          "value": ""
        },
        {
          "name": "userId",
          "type": "userValue",
          "valueName": "userId",
          "value": "Z5TiQPHxZ1LJQwkQLK7f7nSKQXC7dbVJJTOh"
        }

      ],
      "queryParams": [],
      "bodyParams": [

      ],
      "enableResultData": false,
      "outputParameters": [],
      "result": [
      ]
    }

    const response = await this.executeModalBack(satrt_config);
    if (response) {


      if (response['data']) {
        this.activeMode = response['data']['mode']
        this.buttonGroups = response['data']['buttonGroups']
        this.$businessId = response['data']['businessId ']
      }


    }



    // ????????????id
    this.page1.componentDataService.componentInstance['form_01']['instance']['config']['loadingConfig']['ajaxConfig']['params'] = [
      {
        name: 'ID',
        type: 'value',
        value: this.$businessId
      }
    ]
    this.page1.componentDataService.componentInstance['form_01']['instance']['load']();

  }

  public async getButtonData() {
    // http://192.168.1.111:8405/task/enter/{taskinstId}/{userId} 

    let satrt_config = {
      "id": "satrt_ajax",
      "enableAjaxMore": true,
      "url": "http://192.168.1.111:8405/task/enter/{taskinstId}/{userId}",
      "urlType": "inner",
      "ajaxType": "get",
      "headParams": [],
      "pathParams": [
        {
          "name": "taskinstId",
          "type": "tempValue",
          "valueName": "ID",
          "value": ""
        },
        {
          "name": "userId",
          "type": "userValue",
          "valueName": "userId",
          "value": "Z5TiQPHxZ1LJQwkQLK7f7nSKQXC7dbVJJTOh"
        }

      ],
      "queryParams": [],
      "bodyParams": [

      ],
      "enableResultData": false,
      "outputParameters": [],
      "result": [
      ]
    }

    const response = await this.executeModalBack(satrt_config);
    if (response) {


      if (response['data']) {
        this.activeMode = response['data']['mode']
        this.buttonGroups = response['data']['buttonGroups']
      } else {
        this.buttonGroups = [];
        this.activeMode = "";
      }


    }

  }



  public async claim_task(option?) {
    // --????????????
    // http://192.168.1.111:8405/task/claim/{taskinstId}/{userId} -- ????????????id/??????id

    let satrt_config = {
      "id": "satrt_ajax",
      "enableAjaxMore": true,
      "url": "http://192.168.1.111:8405/task/claim/{taskinstId}/{userId}",
      "urlType": "inner",
      "ajaxType": "get",
      "headParams": [],
      "pathParams": [
        {
          "name": "taskinstId",
          "type": "tempValue",
          "valueName": "ID",
          "value": ""
        },
        {
          "name": "userId",
          "type": "userValue",
          "valueName": "userId",
          "value": "Z5TiQPHxZ1LJQwkQLK7f7nSKQXC7dbVJJTOh"
        }

      ],
      "queryParams": [],
      "bodyParams": [

      ],
      "enableResultData": false,
      "outputParameters": [],
      "result": [
      ]
    }

    const response = await this.executeModalBack(satrt_config);
    if (response) {
      if (response['data'] === 0) {
        this.showMessage({ type: 'warning', field: '????????????' });
      } else {
        this.showMessage({ type: 'warning', field: '???????????????' + response['data'] });
      }
    }
  }


  public async cancel_claim_task(option?) {
    // --??????????????????
    // http://192.168.1.111:8405/task/claim/{taskinstId}/{userId} -- ????????????id/??????id

    let satrt_config = {
      "id": "satrt_ajax",
      "enableAjaxMore": true,
      "url": "http://192.168.1.111:8405/task/unclaim/{taskinstId}/{userId}",
      "urlType": "inner",
      "ajaxType": "get",
      "headParams": [],
      "pathParams": [
        {
          "name": "taskinstId",
          "type": "tempValue",
          "valueName": "ID",
          "value": ""
        },
        {
          "name": "userId",
          "type": "userValue",
          "valueName": "userId",
          "value": "Z5TiQPHxZ1LJQwkQLK7f7nSKQXC7dbVJJTOh"
        }

      ],
      "queryParams": [],
      "bodyParams": [

      ],
      "enableResultData": false,
      "outputParameters": [],
      "result": [
      ]
    }

    const response = await this.executeModalBack(satrt_config);
    if (response) {

      this.showMessage({ type: 'success', field: '??????????????????' });

    }
  }

  public handle_task(option?) {
    // ????????????
    /*
    http://192.168.1.111:8405/task/handle 
POST
{
  "taskinstId":"", --?????????????????????id
  "userId": "", --  ?????????id
  "suggest":"", --???????????????
  "attitude":"" --???????????????; AGREE(??????)/DISAGREE(?????????)
}
--???????????????
{
    "data": true/false, -- ????????????????????????
    "error": null,
    "exception": null,
    "success": 1,
    "validation": null,
    "warn": null
}
     */

    // handle  ?????? 
    let dialog;
    const dialogCfg = {
      title: '??????',
      width: "700px",
      style: null,
      maskClosable: false,
      cancelText: '??????',
      okText: '??????',
      config: this.form_handle_config,
      enableCustomFooter: true

    }


    const dialogOptional = {
      nzTitle: dialogCfg.title ? dialogCfg.title : '',
      nzWidth: dialogCfg.width ? dialogCfg.width : '600px',
      nzStyle: dialogCfg.style ? dialogCfg.style : null, // style{top:'1px'},
      nzMaskClosable: dialogCfg.hasOwnProperty('maskClosable') ? dialogCfg.maskClosable : false,
      nzContent: components['form'],
      nzComponentParams: {
        config: dialogCfg.config,
        changeValue: [],
        enableCustomFooter: true,
        dialog: this
      },
      nzFooter1: null,
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

            console.log('??????????????????', componentInstance.validateForm.value)
            // ?????? ??????
            this.handle_task_exec(componentInstance.validateForm.value)
            dialog.close();

          },
        },
      ],
    };
    dialog = this.componentService.modalService.create(dialogOptional);

  }

  public async handle_task_exec(formData?) {
    /*
 http://192.168.1.111:8405/task/handle 
  POST
{
"taskinstId":"", --?????????????????????id
"userId": "", --  ?????????id
"suggest":"", --???????????????
"attitude":"" --???????????????; AGREE(??????)/DISAGREE(?????????)
}
--???????????????
{
 "data": true/false, -- ????????????????????????
 "error": null,
 "exception": null,
 "success": 1,
 "validation": null,
 "warn": null
}
  */

    let satrt_config = {
      "id": "satrt_ajax",
      "enableAjaxMore": true,
      "url": "http://192.168.1.111:8405/task/handle",
      "urlType": "inner",
      "ajaxType": "post",
      "headParams": [],
      "pathParams": [


      ],
      "queryParams": [],
      "bodyParams": [
        {
          "name": "taskinstId",
          "type": "tempValue",
          "valueName": "ID",
          "value": ""
        },
        {
          "name": "userId",
          "type": "userValue",
          "valueName": "userId",
          "value": "Z5TiQPHxZ1LJQwkQLK7f7nSKQXC7dbVJJTOh"
        },
        {
          "name": "suggest",
          "type": "item",
          "valueName": "suggest",
          "value": ""
        },
        {
          "name": "attitude",
          "type": "item",
          "valueName": "attitude",
          "value": ""
        }
      ],
      "enableResultData": false,
      "outputParameters": [],
      "result": [
      ]
    }

    const response = await this.executeModalBack(satrt_config, formData);
    if (response && response.success === 1) {
      if (response['data'] === true) {
        this.showMessage({ type: 'success', field: '??????????????????' });
      } else {
        this.showMessage({ type: 'info', field: '????????????' });
        this.getButtonData();
      }
    }
  }



  public dispatch_task(option?) {
    if (!option) {
      option = {};
    }
    // ????????????
    /*
        --????????????(flow??????????????????????????????????????????) ?????????????????????????????????????????????????????????
        http://192.168.1.111:8405/task/dispatch
        POST
        {
          "userId": "????????????", --?????????????????????id
          "taskinstId": "????????????", --???????????????????????????id
          "target": "", --????????????(??????????????????)id, ?????????flow?????????target???
          "assignedUserIds": "" --???????????????, ?????????, ??????
        }
      }
         */

    // handle  ?????? 
    let dialog;
    const dialogCfg = {
      title: '????????????',
      width: "700px",
      style: null,
      maskClosable: false,
      cancelText: '??????',
      okText: '??????',
      config: this.dispatch_config,
      enableCustomFooter: true

    }

    /* 
        http://192.168.1.111:8405/task/assignableUser/query
        POST
        {
          "userId": "????????????", --?????????????????????id
          "taskinstId": "????????????", --???????????????????????????id
          "type": "????????????", --?????????????????????????????????(?????????????????????????????????type???)
          "target": "" --????????????(??????????????????)id; ?????????????????????????????????????????????????????????; ???????????????, ?????????option??????, ????????????
        }
    */

    const _changeValue = [
      {
        "name": "p_taskinstId",
        "type": "value",
        "value": this.tempValue['ID'],
        "valueTo": "tempValue"
      },
      {
        "name": "p_type",
        "type": "value",
        "value": option['type'],
        "valueTo": "tempValue"
      },
      {
        "name": "p_target",
        "type": "value",
        "value": option['target'],
        "valueTo": "tempValue"
      }

    ]
    const dialogOptional = {
      nzTitle: dialogCfg.title ? dialogCfg.title : '',
      nzWidth: dialogCfg.width ? dialogCfg.width : '600px',
      nzStyle: dialogCfg.style ? dialogCfg.style : null, // style{top:'1px'},
      nzMaskClosable: dialogCfg.hasOwnProperty('maskClosable') ? dialogCfg.maskClosable : false,
      nzContent: components['form'],
      nzComponentParams: {
        config: dialogCfg.config,
        changeValue: _changeValue,
        enableCustomFooter: true,
        dialog: this
      },
      nzFooter1: null,
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

            console.log('??????????????????', componentInstance.validateForm.value)
            const formData = { ...{ target: option['target'] }, ...componentInstance.validateForm.value }
            this.dispatch_task_exec(formData);
            // ?????? ??????
            dialog.close();

          },
        },
      ],
    };
    dialog = this.componentService.modalService.create(dialogOptional);

  }

  public async dispatch_task_exec(formData?) {
    /*
  --????????????(flow??????????????????????????????????????????)  ?????????????????????????????????????????????????????????
   http://192.168.1.111:8405/task/dispatch
   POST
    {
    "userId":"????????????", --?????????????????????id
    "taskinstId":"????????????", --???????????????????????????id
    "target":"", --????????????(??????????????????)id, ?????????flow?????????target???
    "assignedUserIds": "" --???????????????, ?????????,??????
    
    }
     */

    let satrt_config = {
      "id": "satrt_ajax",
      "enableAjaxMore": true,
      "url": "http://192.168.1.111:8405/task/dispatch",
      "urlType": "inner",
      "ajaxType": "post",
      "headParams": [],
      "pathParams": [],
      "queryParams": [],
      "bodyParams": [
        {
          "name": "taskinstId",
          "type": "tempValue",
          "valueName": "ID",
          "value": ""
        },
        {
          "name": "userId",
          "type": "userValue",
          "valueName": "userId",
          "value": "Z5TiQPHxZ1LJQwkQLK7f7nSKQXC7dbVJJTOh"
        },
        {
          "name": "target",
          "type": "item",
          "valueName": "target",
          "value": ""
        },
        {
          "name": "assignedUserIds",
          "type": "item",
          "valueName": "assignedUserIds",
          "value": ""
        }
      ],
      "enableResultData": false,
      "outputParameters": [],
      "result": [
      ]
    }

    const response = await this.executeModalBack(satrt_config, formData);
    if (response && response.success === 1) {
      if (response['data'] === true) {
        this.showMessage({ type: 'success', field: '??????????????????' });
      } else {
        this.showMessage({ type: 'info', field: '????????????' });
        this.getButtonData();
      }
    }
  }




  public inner_action(btn?) {
    console.log('??????????????????', btn)

    if (btn['type']) {
      switch (btn['type']) {

        case 'handle':
          // ??????
          this.handle_task(btn);
          break;
        case 'claim':
          // ??????
          this.claim_task(btn);
          break;
        case 'unclaim':
          // ????????????
          this.cancel_claim_task(btn);
          break;
        case 'flow':
          // ?????? ????????????????????????????????????????????????
          this.dispatch_task(btn);
          break;


      }

    }
    if (btn['execute']) {
      btn['execute'].forEach(element => {
        // ???????????? ???????????? ??????????????????
        // this[element['trigger']](element);
      });
    }
  }



  form_handle_config = {
    "id": "form_handle",
    "type": "form",
    "component": "form",
    "state": "text",
    "loadingConfig": {
      "id": "loadform"
    },
    "enableLoadStaticData": true,
    "staticDataConfig": {
      "name": "data",
      "type": "value",
      "valueName": "",
      "value": {
        "attitude": "AGREE"
      }
    },
    "formLayout": {
      "id": "b86s2i",
      "type": "layout",
      "title": "????????????b86s2i",
      "rows": [
        {
          "id": "MefhXa",
          "type": "row",
          "cols": [
            {
              "id": "ioj0mV",
              "col": "cc",
              "type": "col",
              "title": "???ioj0mV",
              "span": 24,
              "layoutContain": "input",
              "size": {
                "nzXs": 24,
                "nzSm": 24,
                "nzMd": 24,
                "nzLg": 24,
                "ngXl": 24,
                "nzXXl": 24
              },
              "control": {
                "id": "001"
              }
            },
            {
              "id": "ioj0mV3",
              "col": "cc",
              "type": "col",
              "title": "???ioj0mV",
              "span": 24,
              "layoutContain": "input",
              "size": {
                "nzXs": 24,
                "nzSm": 24,
                "nzMd": 24,
                "nzLg": 24,
                "ngXl": 24,
                "nzXXl": 24
              },
              "control": {
                "id": "002"
              }
            }
          ]
        }
      ]
    },
    "formControls": [
      {
        "id": "001",
        "hidden": true,
        "title": "???????????????",

        "titleConfig": {
          "required": false
        },
        "field": "attitude",
        "labelSize": {
          "span": 4,
          "nzXs": 4,
          "nzSm": 4,
          "nzMd": 4,
          "nzLg": 4,
          "ngXl": 4,
          "nzXXl": 4
        },
        "controlSize": {
          "span": 14,
          "nzXs": 14,
          "nzSm": 14,
          "nzMd": 14,
          "nzLg": 14,
          "ngXl": 14,
          "nzXXl": 14
        },
        "state": "text",
        "text": {
          "type": "label",
          "field": "attitude"
        },
        "editor": {
          "type": "select",
          "field": "attitude",
          "placeholder": "??????",
          "options": [
            {
              "label": "??????",
              "value": "AGREE"
            },
            {
              "label": "?????????",
              "value": "DISAGREE"
            }
          ],
          "width": "100%",
          "labelName": "label",
          "valueName": "value",
          "showSearch": false,
          "serverSearch": false
        }

      },
      {
        "id": "002",
        "hidden": true,
        "title": "??????",

        "titleConfig": {
          "required": false
        },
        "field": "suggest",
        "labelSize": {
          "span": 4,
          "nzXs": 4,
          "nzSm": 4,
          "nzMd": 4,
          "nzLg": 4,
          "ngXl": 4,
          "nzXXl": 4
        },
        "controlSize": {
          "span": 14,
          "nzXs": 14,
          "nzSm": 14,
          "nzMd": 14,
          "nzLg": 14,
          "ngXl": 14,
          "nzXXl": 14
        },
        "state": "text",
        "text": {
          "type": "label",
          "field": "suggest"
        },
        "editor": {
          "type": "textarea",
          "field": "suggest",
          "placeholder": "???????????????",
          "autosize": {
            "minRows": 6,
            "maxRows": 2
          }
        }
      }
    ],
    "formControlsPermissions": [
      {
        "formState": "text",
        "formStateContent": {
          "isLoad": true,
          "loadAjax": {},
          "isDefault": true,
          "defaultComponentValue": {
            "attitude": "AGREE"
          }
        },
        "Controls": [
          {
            "id": "001",
            "state": "edit",
            "hidden": false,
            "readOnly": false
          },
          {
            "id": "002",
            "state": "edit",
            "hidden": false,
            "readOnly": false
          }
        ]
      }
    ],
    "ajaxConfig": [],
    "cascade": {
      "messageSender": [],
      "messageReceiver": []
    },
    "cascadeValue": []
  }


  dispatch_config = {
    "id": "form_dispatch",
    "type": "form",
    "component": "form",
    "state": "text",
    "loadingConfig": {
      "id": "loadform"
    },
    "enableLoadStaticData": true,
    "staticDataConfig": {
      "name": "data",
      "type": "value",
      "valueName": "",
      "value": {
        "attitude": "AGREE"
      }
    },
    "formLayout": {
      "id": "b86s2i",
      "type": "layout",
      "title": "????????????b86s2i",
      "rows": [
        {
          "id": "MefhXa",
          "type": "row",
          "cols": [
            {
              "id": "ioj0mV",
              "col": "cc",
              "type": "col",
              "title": "???ioj0mV",
              "span": 24,
              "layoutContain": "input",
              "size": {
                "nzXs": 24,
                "nzSm": 24,
                "nzMd": 24,
                "nzLg": 24,
                "ngXl": 24,
                "nzXXl": 24
              },
              "control": {
                "id": "001"
              }
            }
          ]
        }
      ]
    },
    "formControls": [
      {
        "id": "001",
        "hidden": true,
        "title": "?????????",

        "titleConfig": {
          "required": false
        },
        "field": "assignedUserIds",
        "labelSize": {
          "span": 4,
          "nzXs": 4,
          "nzSm": 4,
          "nzMd": 4,
          "nzLg": 4,
          "ngXl": 4,
          "nzXXl": 4
        },
        "controlSize": {
          "span": 14,
          "nzXs": 14,
          "nzSm": 14,
          "nzMd": 14,
          "nzLg": 14,
          "ngXl": 14,
          "nzXXl": 14
        },
        "state": "text",
        "text": {
          "type": "label",
          "field": "assignedUserIds"
        },
        "editor": {
          "type": "select",
          "field": "assignedUserIds",
          "placeholder": "??????",
          "options": [
            {
              "label": "??????",
              "value": "Z5TiQPHxZ1LJQwkQLK7f7nSKQXC7dbVJJTOh"
            },
            {
              "label": "??????",
              "value": "rAucqTJNlOpI70S8dJIWxcPqZt9r2G8sB3CY"
            }
          ],
          "loadingConfig1": {
            "id": "loadUsers"
          },

          "width": "100%",
          "labelName": "label",
          "valueName": "value",
          "showSearch": false,
          "serverSearch": false
        }

      }
    ],
    "formControlsPermissions": [
      {
        "formState": "text",
        "formStateContent": {
          "isLoad": true,
          "loadAjax": {},
          "isDefault": true,
          "defaultComponentValue": {

          }
        },
        "Controls": [
          {
            "id": "001",
            "state": "edit",
            "hidden": false,
            "readOnly": false
          }
        ]
      }
    ],
    "ajaxConfig": [
      {
        "id": "loadUsers",
        "enableAjaxMore": true,
        "url": "http://192.168.1.111:8405/task/assignableUser/query",
        "urlType": "inner",
        "ajaxType": "post",
        "headParams": [],
        "pathParams": [],
        "queryParams": [],
        "bodyParams": [
          {
            "name": "taskinstId",
            "type": "tempValue",
            "valueName": "p_taskinstId",
            "value": ""
          },
          {
            "name": "userId",
            "type": "userValue",
            "valueName": "userId",
            "value": ""
          },
          {
            "name": "type",
            "type": "tempValue",
            "valueName": "p_type",
            "value": ""
          },
          {
            "name": "target",
            "type": "tempValue",
            "valueName": "p_target",
            "value": ""
          }
        ],
        "enableResultData": false,
        "outputParameters": [],
        "result": [
        ]

      }

    ],
    "cascade": {
      "messageSender": [],
      "messageReceiver": []
    },
    "cascadeValue": []
  }




  //[??????]???
  /*
     1.??????????????????
     2.???????????????????????????????????????????????????
     config???{
       name:''
     }

     ???????????????????????????
     ?????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????
     ???????????????????????????????????????????????????????????????????????????????????????

   */





}
