import { Component, Inject, Input, OnDestroy, OnInit } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { CN_TOOLBAR_METHOD } from 'src/app/core/relations/bsn-methods/bsn-toolbar-method';
import { BSN_COMPONENT_SERVICES } from 'src/app/core/relations/bsn-relatives';
import { ComponentServiceProvider } from 'src/app/core/services/components/component.service';
import { SmtMessageSenderResolver } from '../../resolver/smt-relation/smt-relation-resolver';
import { SmtComponentBase } from '../smt-component.base';

@Component({
  selector: 'app-smt-toolbar',
  templateUrl: './smt-toolbar.component.html',
  styles: [
    `
      .toolbarGroup {
        margin-right: 8px;
      }
    `,
  ],
})
export class SmtToolbarComponent extends SmtComponentBase implements OnInit, OnDestroy {
  constructor(
    @Inject(BSN_COMPONENT_SERVICES)
    public componentService: ComponentServiceProvider,
  ) {
    super(componentService);
    this.COMPONENT_METHODS = CN_TOOLBAR_METHOD;
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

  ngOnInit(): void {}

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

  public action(cfg) {
    cfg['eventConent'] = this.dataServe['componentsConfig'][cfg['id']]['eventConent'];
    cfg['customCommand'] = this.dataServe['componentsConfig'][cfg['id']]['customCommand'];
    for (let i = 0; i < cfg['eventConent'].length; i++) {
      for (let j = 0; j < cfg['eventConent'][i]['eventContent'].length; j++) {
        new SmtMessageSenderResolver(this).resolve(cfg['eventConent'][i]['eventContent'][j]);
      }
    }
  }
}
