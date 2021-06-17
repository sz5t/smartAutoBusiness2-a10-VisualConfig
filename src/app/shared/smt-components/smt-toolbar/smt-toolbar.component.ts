import { Component, Inject, Input, OnDestroy, OnInit } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { BSN_COMPONENT_SERVICES } from 'src/app/core/relations/bsn-relatives';
import { ComponentServiceProvider } from 'src/app/core/services/components/component.service';
import { SmtCommandResolver } from '../../resolver/smt-command/smt-command.resovel';
import { SmtEventResolver } from '../../resolver/smt-event/smt-event-resolver';
import { SmtMessageReceiverResolver, SmtMessageSenderEnterResolver } from '../../resolver/smt-relation/smt-relation-resolver';
import { SmtComponentBase } from '../smt-component.base';

@Component({
  selector: 'app-smt-toolbar',
  templateUrl: './smt-toolbar.component.html',
  styles: [
    `
      .toolbarGroup {
        margin-right: 8px;
      }
    `
  ]
})
export class SmtToolbarComponent extends SmtComponentBase implements OnInit, OnDestroy {
  constructor(
    @Inject(BSN_COMPONENT_SERVICES)
    public componentService: ComponentServiceProvider,
  ) {
    super(componentService);
    this.ROUTE_VALUE = this.componentService.router;
  }
  @Input() public config; // dataTables 的配置参数
  @Input() public initData;
  @Input() public tempData;
  @Input() public dataServe;

  private _sender_source$: Subject<any>;
  private _receiver_source$: Subject<any>;
  private _trigger_source$: Subject<any>;

  private _receiver_subscription$: Subscription;
  private _sender_subscription$: Subscription;
  private _trigger_receiver_subscription$: Subscription;

  ngOnInit(): void {
    this.editConfig(this.config);
    // console.log('111', this.config);
    // console.log('222', this.ROUTE_VALUE);
    // console.log(this.initData);
    // console.log(this.tempData);
    // console.log(this.dataServe);
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

  public unsubscribeRelation() {
    if (this.subscription$) {
      this.subscription$.unsubscribe();
    }
    if (this.trigger_subscription$) {
      this.trigger_subscription$.unsubscribe();
    }
  }

  public action(cfg, originData) {
    console.log(this.dataServe);
    // console.log(this.cacheValue);
    cfg['eventConent'] = this.dataServe['componentsConfig'][cfg['id']]['eventConent'];
    cfg['customCommand'] = this.dataServe['componentsConfig'][cfg['id']]['customCommand'];
    const model = {
      initValue: this.initData,
      tempValue: this.tempData,
      item: '',
      cacheValue: '',
      componentEvent: cfg['eventConent']
    }
    const eventObj = new SmtEventResolver(this).resolve(model);

    this._sender_source$ = new SmtMessageSenderEnterResolver(this).resolve(eventObj['eventArray']);
    this._sender_subscription$ = this._sender_source$.subscribe();

    new SmtMessageReceiverResolver(this).resolve(cfg['customCommand']);
  }

  public editConfig(cfg) {
    if (cfg['originData'] && cfg.children && cfg.children.length > 0) {
      for (let i = 0; i < cfg.children.length; i++) {
        const children = cfg.children[i]['children']
        const id = cfg.children[i]['id']
        cfg.children[i] = cfg['originData'][id];
        cfg.children[i]['children'] = children;
      }
    }
  }

}
