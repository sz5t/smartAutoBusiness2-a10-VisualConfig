import { Component, Inject, Input, OnDestroy, OnInit } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { CN_CONTAINERS_METHOD } from 'src/app/core/relations/bsn-methods/containers-methods';
import { CN_CONTAINERS_PROPERTY } from 'src/app/core/relations/bsn-property/containers.property.interface';
import { BSN_COMPONENT_SERVICES } from 'src/app/core/relations/bsn-relatives';
import { ComponentServiceProvider } from 'src/app/core/services/components/component.service';
import { ParameterResolver } from '../../resolver/parameter/parameter.resolver';
import { RelationResolver } from '../../resolver/relation/relation.resolver';
import { CnComponentBase } from '../cn-component.base';

@Component({
  selector: 'app-cn-dynamic-containers',
  templateUrl: './cn-dynamic-containers.component.html',
  styles: [
  ]
})
export class CnDynamicContainersComponent extends CnComponentBase implements OnInit, OnDestroy {

  constructor(
    @Inject(BSN_COMPONENT_SERVICES)
    public componentService: ComponentServiceProvider,
  ) {
    super(componentService);
    this.cacheValue = this.componentService.cacheService;
  }

  @Input() public config; // 配置参数
  @Input() initData;
  @Input() tempData;
  @Input() changeValue: any;
  @Input() public permissions = [];
  @Input() public dataList = [];
  @Input() dataServe;

  public COMPONENT_NAME = 'CnContainers';
  /**
   * 组件操作对外名称
   * 所有组件实现此属性
   */
  public COMPONENT_METHODS = CN_CONTAINERS_METHOD;

  public COMPONENT_PROPERTY = CN_CONTAINERS_PROPERTY;

  public view: any;

  public isLoadLayout: any;

  public tempData_new: any;

  public initData_new: any;

  private _sender_source$: Subject<any>;
  private _trigger_source$: Subject<any>;

  private _receiver_subscription$: Subscription;
  private _sender_subscription$: Subscription;
  private _trigger_receiver_subscription$: Subscription;

  ngOnInit(): void {
    this._initInnerValue(); // 初始化当前组件值
    this.resolveRelations(); // 消息
    if (this.config.toolbar) {
      this.cacheValue.set('ApprovalToolBar', this.config.toolbar);
    }

    if (this.config.dialog) {
      this.cacheValue.set('ApprovalFormDialog', this.config.dialog);
    }

    if (this.config.changeValue) {
      this.cacheValue.set('ApprovalChangeValue', this.config.changeValue);
    }

    if (this.config.ajaxParams) {
      this.cacheValue.set('ApprovalAjaxParams', this.config.ajaxParams);
    }

    if (this.config.cascade && this.config.cascade.messageSender.length > 0) {
      this.cacheValue.set('ApprovalMessageSend', this.config.cascade.messageSender);
    }

    if (this.config.cascade && this.config.cascade.messageReceiver.length > 0) {
      this.cacheValue.set('ApprovalMessageReceiver', this.config.cascade.messageReceiver);
    }

    if (this.config.ajaxConfig) {
      this.cacheValue.set('ApprovalInitiateAjax', this.config.ajaxConfig);
    }

    if (this.config.paramsConfig) {
      this.loadAjaxParams();
    }

    if (this.config.loadingOnInit) {
      this.loadPage();
    }
  }

  ngOnDestroy(): void {
    // 释放级联对象
    this.unsubscribeRelation();
    // 释放及联接受对象
    if (this._receiver_subscription$) {
      this._receiver_subscription$.unsubscribe();
    }

    if (this._sender_subscription$) {
      this._sender_subscription$.unsubscribe();
    }

    // 释放触发器对象
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

  public _initInnerValue() {
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

  public resolveRelations() {
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

  public transferValue(option?) {
    console.log('将接受传递的值', this.tempValue);
  }

  /**
   * loadAjaxParams 向切换之后的组件进行传值
   */
  public async loadAjaxParams() {
    const ajaxParams = await this.getAjaxParams()
    delete ajaxParams.data[0].Id;
    this.tempValue = { ...this.tempValue, ...ajaxParams.data[0] }
  }



  public async getAjaxParams() {
    const params = ParameterResolver.resolve({
      params: this.config.paramsConfig.params,
      tempValue: this.tempValue,
      initValue: this.initData,
      cacheValue: this.cacheValue
    });

    const ajaxData = await this.componentService.apiService
      .get(
        this.config.paramsConfig.url,
        params
      ).toPromise();
    return ajaxData;
  }

  public async loadPage() {
    this.isLoadLayout = false
    this.view = null;
    let jsonName;
    let jsonConfig;
    if (this.config.carrierConfig) {
      const filedName = this.config.carrierConfig.name;
      const datatype = this.config.carrierConfig.datatype;
      const conditionArray = this.config.carrierConfig.condition;
      const index = conditionArray.findIndex(e => e['value'] === this[datatype][filedName])
      jsonConfig = conditionArray[index];
    }
    if (jsonConfig) {
      if (jsonConfig.replaceJson) {
        if (jsonConfig.ajaxJsonName) {
          // const changeJsonName = await this.changeJsonName();
          // jsonName = changeJsonName;
        } else {
          // jsonName = jsonConfig.replaceJsonName
        }
      }
    } else {
      if (this.config.getAsncData) {
        const response = await this._getAsyncData();
        if (response && response.data.length > 0) {
          jsonName = response.data[0]['TYSE_RESOUCE_JSON']
        } else {
          jsonName = this.config.defaultJson;
        }
      } else {
        jsonName = this.config.defaultJson;
      }
    }
    await this.getCustomConfig(jsonName);
    const currentView = this.getMenuComponentConfigById(jsonName);
    this.view = currentView
    this.isLoadLayout = true;
    this.tempValue['$_processType'] = 'process'
    this.initData_new = this.initData;
    this.tempData_new = this.tempValue;
  }

  public async _getAsyncData() {
    const params = ParameterResolver.resolve({
      params: this.config.loadingConfig.params,
      tempValue: this.tempValue,
      initValue: this.initData,
      cacheValue: this.cacheValue
    });

    const ajaxData = await this.componentService.apiService
      .get(
        this.config.loadingConfig.url,
        params
      ).toPromise();
    return ajaxData;
  }

  /**
   * 显示消息框
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

}
