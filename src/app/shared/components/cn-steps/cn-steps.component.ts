import { Component, OnInit, OnDestroy, Input, Inject } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { CN_STEPS_METHOD } from 'src/app/core/relations/bsn-methods/bsn-steps-method';
import { BSN_COMPONENT_SERVICES } from 'src/app/core/relations/bsn-relatives';
import { ComponentServiceProvider } from 'src/app/core/services/components/component.service';
import { ParameterResolver } from '../../resolver/parameter/parameter.resolver';
import { RelationResolver } from '../../resolver/relation/relation.resolver';
import { CnComponentBase } from '../cn-component.base';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'cn-steps,[cn-steps]',
  templateUrl: './cn-steps.component.html',
  styles: [
    `
      .steps-content {
        margin-top: 16px;
        border: 1px dashed #e9e9e9;
        border-radius: 6px;
        background-color: #fafafa;
        min-height: 200px;

        padding: 8px;
      }
      .steps-content-grid {
        margin-top: 16px;
        border: 1px dashed #e9e9e9;
        border-radius: 6px;
        background-color: #fafafa;
        min-height: 200px;

        padding: 8px;
        display: grid;
      }

      .alert {
        margin-top: 10px;
      }
      .alert-grid {
        margin-top: 10px;
        display: grid;
      }

      .steps-action {
        margin-top: 24px;
      }

      button {
        margin-right: 8px;
      }
      .float_left {
        float: left;
        padding-left: 20px;
        padding-right: 20px;
      }
      .float_none {
        padding-left: 20px;
        padding-right: 20px;
      }
    `,
  ],
})
export class CnStepsComponent extends CnComponentBase implements OnInit, OnDestroy {
  @Input()
  public config: any;
  @Input() initData;
  @Input() tempData;

  public CURRENT_DATA;
  public CURRENT_DATA_SET;
  public COMPONENT_METHODS = CN_STEPS_METHOD;
  public showAlert = false;
  public stepItems: {
    title?: string;
    desc?: string;
    icon?: string;
    subTitle?: string;
    status?: string;
  }[];

  // 对组件已经有的数据留痕
  public mapOfStepData: {
    index: number;
    refStepItem: string;
    status: string;
    cacheData: object;
  }[] = [];

  // 缓存字段的映射
  public mapOfField: [] = [];

  public current = 0;
  // 步骤的最大值
  public maxLength: number;
  public currentViews;

  private _sender_source$: Subject<any>;
  private _trigger_source$: Subject<any>;

  private _receiver_subscription$: Subscription;
  private _sender_subscription$: Subscription;
  private _trigger_receiver_subscription$: Subscription;
  constructor(
    @Inject(BSN_COMPONENT_SERVICES)
    public componentService: ComponentServiceProvider,
  ) {
    super(componentService);
    this.cacheValue = this.componentService.cacheService;
  }

  ngOnInit(): void {
    this.currentViews = this.config.stepViews.filter((v) => v.id === this.config.stepViews[this.current].id);
    this._initInnerValue();
    this.resolveRelations();
    this._initSteps();
    if (this.config.loadingOnInit) {
      this.load();
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

  public load() {
    const ajaxObj = this._findAjaxById(this.config.loadingConfig.id);
    const params = {
      ...this._buildParameters(ajaxObj.params),
    };
    this.componentService.apiService.getRequest(ajaxObj.url, ajaxObj.method, { params }).subscribe((response) => {
      if (response.data) {
        this._stepsDataMappingResolve(response.data);
        if (response.data.length > 0) {
          this.CURRENT_DATA_SET = response.data;
          this.CURRENT_DATA = response.data[0];
          this.innerParamsResolve(this.config.innerParams);
        }
      } else {
        this._initSteps();
      }
    });
  }

  public changeIndexAsRefresh() { }

  public changeIndexAsReplace() { }

  public onIndexChange(index) {
    this.current = index;
    if (!this.config.loadingOnInit) {
      this.CURRENT_DATA_SET = this.stepItems;
    }
    this.CURRENT_DATA = this.CURRENT_DATA_SET[index];
    if (this.config.stepMapping) {
      this._stepMappingResolve();
    } else {
      if (!this.currentViews || this.currentViews.length > 0) {
        const step = this.config.stepViews[index] ? this.config.stepViews[index] : this.config.stepViews[0];

        // this.showAlert = !this.showAlert;
        this.currentViews = this.config.stepViews.filter((v) => v.id === step.id);
      }
    }
    this.innerParamsResolve(this.config.innerParams);
  }

  public getCurrentComponentId() {
    return this.config.id;
  }

  private innerParamsResolve(innerParams) {
    if (innerParams && innerParams.length > 0) {
      for (const p of innerParams) {
        switch (p.valueTo) {
          case 'tempValue':
            this.tempValue[p.name] = this.CURRENT_DATA[p.valueName];
            break;
          case 'initValue':
            this.initValue[p.name] = this.CURRENT_DATA[p.valueName];
            break;
        }
      }
    }
  }

  /**
   * 解析级联消息
   */
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

  private _findAjaxById(id) {
    return this.config.ajaxConfig.find((f) => f.id === id);
  }

  private _initInnerValue() {
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

  private _buildParameters(paramsCfg) {
    return ParameterResolver.resolve({
      params: paramsCfg,
      tempValue: this.tempValue,
      initValue: this.initValue,
      cacheValue: this.cacheValue,
      item: this.CURRENT_DATA,
      userValue: this.userValue,
    });
  }

  private _initSteps() {
    this.stepItems = this.config.stepItems ? this.config.stepItems : [];
    this.maxLength = this.stepItems.length ? this.stepItems.length - 1 : 0;
    this.mapOfField = this.config.stepFieldMapping ? this.config.stepFieldMapping : [];
  }

  private _stepsDataMappingResolve(data) {
    this.stepItems = [];
    data.forEach((res) => {
      const dataItem = {};
      if (this.config.dataMapping && this.config.dataMapping.length > 0) {
        this.config.dataMapping.forEach((d, index) => {
          if (res[d.field]) {
            dataItem[d.name] = res[d.field];
            this._stepStatusMappingResolve(dataItem, res);
          }
        });
      }

      this.stepItems.push(dataItem);
    });
    this.maxLength = this.stepItems.length;
  }

  private _stepMappingResolve() {
    if (this.config.stepMapping && this.config.stepMapping.length > 0) {
      this.config.stepMapping.forEach((m) => {
        if (this.CURRENT_DATA[m.field] && this.CURRENT_DATA[m.field] === m.value) {
          this.currentViews = this.config.stepViews.filter((v) => v.id === m.targetId);
        }
      });
    }
  }

  private _stepStatusMappingResolve(dataItem, data) {
    if (this.config.stepStatusMapping) {
      for (const s in this.config.stepStatusMapping) {
        if (this.config.stepStatusMapping.hasOwnProperty(s)) {
          const status = this._getStatus(this.config.stepStatusMapping[s], data);
          if (s === 'await' && status) {
            dataItem.status = 'await';
          }
          if (s === 'process' && status) {
            dataItem.status = 'process';
          }
          if (s === 'finish' && status) {
            dataItem.status = 'finish';
          }
          if (s === 'error' && status) {
            dataItem.status = 'error';
          }
        }
      }
      console.log(dataItem);
    }
  }

  private _getStatus(awaitCfg, data) {
    let status: boolean;
    awaitCfg.forEach((s) => {
      if (data[s.field] && data[s.field] === s.value) {
        status = true;
      } else if (data[s.field] && data[s.field] !== s.value) {
        status = false;
      }
    });
    return status;
  }

  /**
   * buildParameters 构建参数
   */
  public buildParameters(paramsCfg, data?, isArray = false) {
    let parameterResult: any | any[];
    if (!isArray && !data) {
      parameterResult = ParameterResolver.resolve({
        params: paramsCfg,
        tempValue: this.tempValue,
        initValue: this.initValue,
        cacheValue: this.cacheValue,
        router: this.routerValue,
        outputValue: data,
        returnValue: data,
        userValue: this.userValue,
      });
    } else if (!isArray && data) {
      if (data._procedure_resultset_1) {
        data = { ...data._procedure_resultset_1[0], ...data };
      }
      parameterResult = ParameterResolver.resolve({
        params: paramsCfg,
        tempValue: this.tempValue,
        item: data,
        initValue: this.initValue,
        cacheValue: this.cacheValue,
        router: this.routerValue,
        addedRows: data,
        editedRows: data,
        validation: data,
        returnValue: data,
        outputValue: data,
        userValue: this.userValue,
      });
    } else if (isArray && data && Array.isArray(data)) {
      parameterResult = [];
      data.map((d) => {
        const param = ParameterResolver.resolve({
          params: paramsCfg,
          tempValue: this.tempValue,
          componentValue: d,
          item: d,
          initValue: this.initValue,
          cacheValue: this.cacheValue,
          router: this.routerValue,
          addedRows: d,
          editedRows: d,
          validation: d,
          returnValue: d,
          outputValue: data,
          userValue: this.userValue,
        });
        parameterResult.push(param);
      });
    }
    return parameterResult;
  }

  public onlyStepOnIndexChange($event) {

  }

  // 定义步骤组件的切换方法：上一步pre，下一步next，完成finish
  // 跳转时满足验证跳转
  public pre() {
    if (this.current > 0) {
      this.changeContent(this.current - 1);
      this.lastSendMessage()
    }
  }

  public next() {
    if (this.current < this.maxLength) {
      this.changeContent(this.current + 1);
      this.nextSendMessage();
    }
  }

  public finish() {
    if (this.current === this.maxLength) {
      // 暂定执行finishConfig里面的资源调用。具体发布数据库的口先留着
    }
  }

  // 不可点击步骤时，实际切换内容组建的方法
  public changeContent(index) {
    this.onIndexChange(index);
    this.tempValue['CURRENT_STEP'] = index;
    // console.log(this.tempValue);
  }

  // 下一步触发消息的方法
  public nextSendMessage() {
    return true;
  }

  // 上一步触发消息的方法
  public lastSendMessage() {
    const msgConfig = this.config.hasOwnProperty('preSendMsgConfig') ? this.config.preSendMsgConfig : ' '
    this.sendDataSuccessMessage(msgConfig);
    return true;
  }

  private sendDataSuccessMessage(msgConfig) {
    if (msgConfig) {
      new RelationResolver(this).resolveInnerSender(msgConfig, {}, false);
    }
  }

  // 接收消息中的数据
  public messageSendValue() {
    // 1.接收参数的时候，current需要-1存储上一个节点的信息
    // 2.根据配置中的字段映射stepFieldMapping对象，完成组件值缓存的回写
    // 映射缓存的时候，需要适配各式参数类型
    const cacheDataIndex = this.current - 1;
    const currentCache = {};
    if (this.mapOfField.length > 0) {
      this.mapOfField.forEach(f => {
        if (f['step'] === cacheDataIndex) {
          const propertyObj: any = f['field']
          for (const property in propertyObj) {
            currentCache[propertyObj[property]] = this.tempValue[property]
          }
        }
      })
      if (this.mapOfStepData.findIndex(e => e.index === cacheDataIndex) > 0) {
        this.mapOfStepData[cacheDataIndex]['cacheData'] = currentCache
      } else {
        this.mapOfStepData.push({
          index: cacheDataIndex,
          refStepItem: this.stepItems[cacheDataIndex]['title'],
          status: 'done',
          cacheData: currentCache
        })
      }
    }
    // console.log(this.mapOfStepData)
  }
}
