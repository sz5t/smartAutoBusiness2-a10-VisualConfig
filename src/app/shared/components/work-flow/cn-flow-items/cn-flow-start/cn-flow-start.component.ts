import { AfterViewInit, Component, ComponentFactoryResolver, ComponentRef, Inject, Input, OnInit, Type, ViewChild, ViewContainerRef } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { CN_FLOW_PREVIEW_METHOD } from 'src/app/core/relations/bsn-methods/bsn-flow-preview-methods';
import { CN_FLOW_PREVIEW_PROPERTY } from 'src/app/core/relations/bsn-property/data-flow-preview.property.interface';
import { BSN_COMPONENT_SERVICES } from 'src/app/core/relations/bsn-relatives';
import { ComponentServiceProvider } from 'src/app/core/services/components/component.service';
import { ParameterResolver } from 'src/app/shared/resolver/parameter/parameter.resolver';
import { RelationResolver } from 'src/app/shared/resolver/relation/relation.resolver';
import { CnComponentBase } from '../../../cn-component.base';
import { CnPageComponent } from '../../../cn-page/cn-page.component';
const components: { [type: string]: Type<any> } = {
  page: CnPageComponent
};
@Component({
  selector: 'app-cn-flow-start',
  templateUrl: './cn-flow-start.component.html',
  styles: [
    `.toolbarGroup {
      margin-right:8px;
      float:right;
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
export class CnFlowStartComponent extends CnComponentBase implements OnInit, AfterViewInit {
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
   * 组件操作对外名称
   * 所有组件实现此属性
   */
  public COMPONENT_METHODS = CN_FLOW_PREVIEW_METHOD;

  public COMPONENT_PROPERTY = CN_FLOW_PREVIEW_PROPERTY;
  public FORM_VALUE: any = {}; // 当前表单组件值
  public FORM_STATE: any; // 表单的状态=》新增、修改、展示
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
  ngAfterViewInit(): void {
    // throw new Error('Method not implemented.');

    console.log('ppppppppppppppppppppppppppppppppp');

  }


  public modelstyle = {
    width: '100%',
    'min-height': (window.document.body.clientHeight - 170).toString() + 'px',

  };
  // height: (window.document.body.clientHeight - 170).toString() + 'px',
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
      try {
        let aa_page = JSON.parse(this.tempValue['PAGE_ID']);
        this.a_page = aa_page;
      } catch { }

      this.config['layoutName'] = this.a_page.start.layoutName;

    } else {
      this.config['layoutName'] = "52sFEpgUYV1u7KVU4VI0PwST0ZFeWknEcNCb";
    }

    if (this.a_page) {
      await this.getJson();
    }



    this.set_satrt_page_load();
    this.resolveRelations();
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
    this._componentRef.instance.childrenPage = this.a_page['start']['showPageHeader'];
    this._componentRef.instance.changeValue = [
      {

        name: '$WF_CODE',
        type: 'value',
        value: this.tempValue['CODE'],
        valueTo: 'tempValue'
      },
      {

        name: '$WF_VERSION',
        type: 'value',
        value: this.tempValue['VERSION'],
        valueTo: 'tempValue'
      }
    ];
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


  // 组件标识【page_componentId】=> 

  /*
   
    【发起】:表单发起、业务数据勾选发起
    【表单发起】
     配置：（全局表单）表单状态【新增】、【查看】 两种 

     pageId \52sFEpgUYV1u7KVU4VI0PwST0ZFeWknEcNCb\

     数据集的=》选中数据【提交】，草稿



   */
  a_page: any;
  a_page1 = {
    start: { // 发起启动页面
      type: 'page',  // page/form  
      layoutName: "52sFEpgUYV1u7KVU4VI0PwST0ZFeWknEcNCb",
      tagComponent: {
        tagComponentId: "system_user_table1",  // 目标组件
        "component": "cnDataTable",
        tagComponentWhere: {  // ? 注意参数结构是填充至路径参数？查询参数？ 老结构填充至parems
          params: [
            {
              "name": "ID",
              "type": "value",
              "value": "hnfOwehxzAtjyDKBNLcjmWMVcjO3qLwM4gGB"
            }
          ]
        },
        tagValue: {
          "businessData": "ROW_SELECTED",// 提交数据取值
          "businessId": "ID"
        }
      }

    },
    approval: {  // 流转过程页面【一般是表单等、做内容展示】
      layoutName: "52sFEpgUYV1u7KVU4VI0PwST0ZFeWknEcNCb",
      tagComponent: {
        tagComponentId: "comid",  // 目标组件
        tagComWhere: { // ? 注意参数结构是填充至路径参数？查询参数？ 老结构填充至parems
          params: [{
            name: ""
          }]
        }
      }
    }
  }

  load_count = 0;
  public set_satrt_page_load = () => {
    // a_page
    console.log('启动页配置加载:', this.a_page, this.load_count);

    if (!this.page1 && !this.page1.componentDataService && !this.page1.componentDataService.componentInstance && this.load_count < 2) {
      this.load_count++;

      setTimeout(this.set_satrt_page_load, 300);
      return;
    }
    let com_instance = this.page1.componentDataService.componentInstance;
    let comptId = this.a_page['start']['tagComponent']['tagComponentId'];
    let tag_businessData = this.a_page['start']['tagComponent']['tagValue']['businessData'];
    let tag_businessId = this.a_page['start']['tagComponent']['tagValue']['businessId'];
    let c_instance = this.page1.componentDataService.componentInstance[comptId];
    if (c_instance) {
      // 将参数结构合并，替换同名参数
      console.log('dddd', c_instance);

      switch (c_instance['instance']['config']['component']) {
        case "form":
          this.setComponentLoadingConfigByForm(c_instance);
          break;
        case "cnDataTable":
          this.setComponentLoadingConfigByTable(c_instance);
          break;

        default:
          this.setComponentLoadingConfigByTable(c_instance);
          break;
      }

      c_instance['instance']['load']();


    } else {
      setTimeout(this.set_satrt_page_load, 300);
    }



  }

  public setComponentLoadingConfigByTable(c_instance) {
    const tagComponentWhere = this.a_page['start']['tagComponent']['tagComponentWhere'];

    // ['loadingConfig']['ajaxConfig']
    for (let k in this.a_page['start']['tagComponent']['tagComponentWhere']) {
      let s = tagComponentWhere[k];
      if (c_instance['instance']['config']["loadingConfig"][k]) {

        s.forEach(item => {
          const index = c_instance['instance']['config']["loadingConfig"][k].findIndex((r) => r['name'] === item['name'])

          if (index < 0) {
            c_instance['instance']['config']["loadingConfig"][k].push(item);
            // 新增
          } else {
            //替换
            c_instance['instance']['config']["loadingConfig"][k][index] = item;
          }

        });

      } else {
        c_instance['instance']['config']["loadingConfig"][k] = s;
      }

    }
  }

  public setComponentLoadingConfigByForm(c_instance) {
    const tagComponentWhere = this.a_page['start']['tagComponent']['tagComponentWhere'];

    // ['loadingConfig']['ajaxConfig']
    for (let k in this.a_page['start']['tagComponent']['tagComponentWhere']) {
      let s = tagComponentWhere[k];
      if (c_instance['instance']['config']["loadingConfig"]['ajaxConfig'][k]) {

        s.forEach(item => {
          const index = c_instance['instance']['config']["loadingConfig"]['ajaxConfig'][k].findIndex((r) => r['name'] === item['name'])

          if (index < 0) {
            c_instance['instance']['config']["loadingConfig"]['ajaxConfig'][k].push(item);
            // 新增
          } else {
            //替换
            c_instance['instance']['config']["loadingConfig"]['ajaxConfig'][k][index] = item;
          }

        });

      } else {
        c_instance['instance']['config']["loadingConfig"]['ajaxConfig'][k] = s;
      }

    }
  }

  public get_satrt_itemData() {
    // a_page
    console.log('启动页配置:', this.a_page);
    let com_instance = this.page1.componentDataService.componentInstance;

    let comptId = this.a_page['start']['tagComponent']['tagComponentId'];
    let tag_businessData = this.a_page['start']['tagComponent']['tagValue']['businessData'];
    let tag_businessId = this.a_page['start']['tagComponent']['tagValue']['businessId'];
    let c_instance = this.page1.componentDataService.componentInstance[comptId];
    let c_businessData = c_instance.instance[tag_businessData];
    let c_businessId = c_businessData[tag_businessId];

    console.log('提交业务数据:', c_businessData, "提交业务数据id:", c_businessId, this.tempValue);
    const data_item = { businessId: c_businessId, businessData: c_businessData };
    if (c_businessId) {
      return data_item;

    } else {
      this.showMessage({ type: 'warning', field: '请选择业务数据' });
      return null;
    }

  }

  public inner_action(btn?) {
    if (btn['execute'] && this.a_page) {
      btn['execute'].forEach(element => {
        this[element['trigger']](element);
      });
    }
  }
  public async onStart(option?) {

    let save_config = {};
    if (option) {
      if (option.hasOwnProperty('ajaxId')) {
        if (this.config.ajaxConfig) {
          this.config.ajaxConfig.forEach(element => {
            if (element.id === option['ajaxId']) {
              save_config = element
            }
          });
        }
      }
    }

    let itemData = this.get_satrt_itemData();
    if (itemData) {
      let d = await this.executeModal(save_config, itemData);
      if (d) {
        let com_instance = this.page1.componentDataService.componentInstance;
        let comptId = this.a_page['start']['tagComponent']['tagComponentId'];
        let tag_businessData = this.a_page['start']['tagComponent']['tagValue']['businessData'];
        let tag_businessId = this.a_page['start']['tagComponent']['tagValue']['businessId'];
        let c_instance = this.page1.componentDataService.componentInstance[comptId];
        c_instance.instance['load']();
      }

    }
  }


  // 页面组件实例
  public setTest() {
    this.page1.test_get();
  }


  /**
 * 显示消息框
 * @param option
 */
  public showMessage(option) {
    let msgObj;
    if (option && Array.isArray(option)) {
      // 后续需要根据具体情况解析批量处理结果
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

  public async executeModal(execConfig, data?) {


    console.log('-------------执行sql', execConfig);
    // 构建业务对象
    // 执行异步操作
    // this.componentService.apiService.doPost();
    const url = execConfig.url;
    const params = this.buildParameters(execConfig.params);
    //  console.log(this.config.id + '-------------执行sql params:', params);
    const back = false;

    let response: any;
    if (execConfig['enableAjaxMore']) {
      response = await this.executeHttpMore(execConfig, data, 'buildParameters', null);
    } else {
      response = await this.componentService.apiService[execConfig.ajaxType](url, params).toPromise();
    }
    // 批量对象数据,返回结果都将以对象的形式返回,如果对应结果没有值则返回 {}
    this._sendDataSuccessMessage(response, execConfig.result);

    // 处理validation结果
    const validationResult = this._sendDataValidationMessage(response, execConfig.result);

    // 处理error结果
    const errorResult = this._sendDataErrorMessage(response, execConfig.result);

    return validationResult && errorResult;

  }

  private _sendDataSuccessMessage(response, resultCfg): boolean {
    let result = false;
    if (Array.isArray(response.data) && response.data.length <= 0) {
      return result;
    }
    if (response && response.data) {
      const successCfg = resultCfg.find((res) => res.name === 'data');
      // 弹出提示框
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

}
