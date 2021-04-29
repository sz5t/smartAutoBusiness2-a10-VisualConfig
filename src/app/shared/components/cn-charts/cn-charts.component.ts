import { AfterViewInit, Component, EventEmitter, Inject, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { CN_CHARTS_METHOD } from 'src/app/core/relations/bsn-methods/bsn-charts-methods';
import { CN_CHARTS_PROPERTY } from 'src/app/core/relations/bsn-property/charts.property.interface';
import { BSN_COMPONENT_SERVICES } from 'src/app/core/relations/bsn-relatives';
import { ComponentServiceProvider } from 'src/app/core/services/components/component.service';
import { RelationResolver } from '../../resolver/relation/relation.resolver';
import { CnComponentBase } from '../cn-component.base';

@Component({
  selector: 'cn-charts,[cn-charts]',
  templateUrl: './cn-charts.component.html',
  styles: [
  ]
})
export class CnChartsComponent extends CnComponentBase implements OnInit, AfterViewInit, OnDestroy {

  constructor(
    @Inject(BSN_COMPONENT_SERVICES)
    public componentService: ComponentServiceProvider,
  ) {
    super(componentService);
    this.cacheValue = this.componentService.cacheService;
  }

  @Input() public config; // dataTables 的配置参数
  @Input() public initData;
  @Input() public tempData;
  @Input() changeValue: any;
  @Input() public permissions = [];
  @Input() public dataList = [];
  @Input() dataServe;
  @Output() public updateValue = new EventEmitter();
  /**
   * 组件名称
   * 所有组件实现此属性
   */
  public COMPONENT_NAME = 'CnCharts';
  /**
   * 组件操作对外名称
   * 所有组件实现此属性
   */
  public COMPONENT_METHODS = CN_CHARTS_METHOD;

  public COMPONENT_PROPERTY = CN_CHARTS_PROPERTY;

  private _sender_source$: Subject<any>;
  private _receiver_source$: Subject<any>;
  private _trigger_source$: Subject<any>;

  private _receiver_subscription$: Subscription;
  private _sender_subscription$: Subscription;
  private _trigger_receiver_subscription$: Subscription;

  public chartConfig: any = {}

  public ngOnInit(): void {
    // 解析及联配置
    this.resolveRelations();
    if (this.config.loadingOnInit) {
      this.chartConfig = this.config
    }
  }

  public ngAfterViewInit() { }

  public getCurrentComponentId() {
    return this.config.id;
  }

  public ngOnDestroy() {
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
