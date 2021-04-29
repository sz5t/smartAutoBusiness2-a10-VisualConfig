import { Component, Inject, Input, OnDestroy, OnInit } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { CN_TIMELINE_METHOD } from 'src/app/core/relations/bsn-methods/bsn-timeline-methods';
import { BSN_COMPONENT_SERVICES } from 'src/app/core/relations/bsn-relatives';
import { ComponentServiceProvider } from 'src/app/core/services/components/component.service';
import { ParameterResolver } from '../../resolver/parameter/parameter.resolver';
import { RelationResolver } from '../../resolver/relation/relation.resolver';
import { CnComponentBase } from '../cn-component.base';

@Component({
  selector: 'cn-time-line,[cn-time-line]',
  templateUrl: './cn-time-line.component.html',
  styles: [
  ]
})
export class CnTimeLineComponent extends CnComponentBase implements OnInit, OnDestroy {
  @Input()
  public config: any;
  @Input() initData;
  @Input() tempData;

  public dataList = []; // 数据集

  public COMPONENT_METHODS = CN_TIMELINE_METHOD;

  public mappingOfMark: any;

  public colorFiled: any;

  public contentFiled: any;

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

    this.mappingOfMark = this.config.markMapping ? this.config.markMapping : []

    this.colorFiled = this.config.colorFiled ? this.config.colorFiled : ''

    this.contentFiled = this.config.contentField ? this.config.contentField : ''

    this._initInnerValue();
    this.resolveRelations();
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

  public async load() {
    if (!this.config.loadingConfig) {
      return;
    }
    const url = this.config.loadingConfig.url;
    const method = this.config.loadingConfig.method ? this.config.loadingConfig.method : this.config.loadingConfig.ajaxType;

    const params = {
      ...this.buildParameters(this.config.loadingConfig.params)
    };

    const response: any = await this.componentService.apiService.getRequest(url, method, { params }).toPromise();

    if (response && response.data) {
      this.dataList = response.data

      this.dataList.forEach(data => {
        data['color'] = 'blue'
        data['content'] = ''
        if (this.mappingOfMark.length > 0 && this.colorFiled !== '') {
          if (data.hasOwnProperty(this.colorFiled)) {
            this.mappingOfMark.forEach(mark => {
              if (data[this.colorFiled] === mark['name']) {
                data['color'] = mark['value']
              }
            });
            if (!data.hasOwnProperty('color')) {
              data['color'] = this.mappingOfMark[this.mappingOfMark.findIndex(e => e['name'] === 'default')]['value']
            }
          }
        }

        if (this.contentFiled !== '') {
          if (data.hasOwnProperty(this.contentFiled)) {
            data['content'] = data[this.contentFiled]
          }
        }

      });
    }

    this.dataList = this.dataList.filter(e => e.Id !== null)
  }

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
        menuValue: this.componentService.cacheService.getNone('activeMenu') ? this.componentService.cacheService.getNone('activeMenu') : {},
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
        menuValue: this.componentService.cacheService.getNone('activeMenu') ? this.componentService.cacheService.getNone('activeMenu') : {},
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
          userValue: this.userValue,
          menuValue: this.componentService.cacheService.getNone('activeMenu')
            ? this.componentService.cacheService.getNone('activeMenu')
            : {},
        });
        parameterResult.push(param);
      });
    }
    return parameterResult;
  }

  public getCurrentComponentId() {
    return this.config.id;
  }

  public clickNode(item) {
    // console.log(item);
    const sendConfig = this.config.cascade.messageSender.find(e => e['trigger'] === 'CLICK_NODE')
    const sender = { senderId: sendConfig['id'] }
    new RelationResolver(this).resolveInnerSender(sender, item, false);
    return true;
  }

}
