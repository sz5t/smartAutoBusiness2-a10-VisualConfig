import { Component, Inject, Input, OnInit } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { BSN_COMPONENT_SERVICES } from 'src/app/core/relations/bsn-relatives';
import { ComponentServiceProvider } from 'src/app/core/services/components/component.service';
import { SmtEventResolver } from '../../resolver/smt-event/smt-event-resolver';
import { SmtMessageSenderEnterResolver } from '../../resolver/smt-relation/smt-relation-resolver';
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
export class SmtToolbarComponent extends SmtComponentBase implements OnInit {
  constructor(
    @Inject(BSN_COMPONENT_SERVICES)
    public componentService: ComponentServiceProvider,
  ) {
    super(componentService);
    this.routerValue = this.componentService.router;
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
    // console.log('111', this.routerValue);
    // console.log(this.initData);
    // console.log(this.tempData);
    // console.log(this.dataServe);
  }

  public action(cfg, originData) {
    // console.log(cfg);
    // console.log(this.cacheValue);
    cfg['eventConent'] = this.dataServe['componentsConfig'][cfg['id']]['eventConent'];
    const model = {
      initValue: this.initData,
      tempValue: this.tempData,
      item: '',
      cacheValue: '',
      componentEvent: cfg['eventConent']
    }
    const eventObj = new SmtEventResolver(this).resolve(model, 'PAGE_CODE');
    this._sender_source$ = new SmtMessageSenderEnterResolver(this).resolver(eventObj['eventArray'], eventObj['param']);
    this._sender_subscription$ = this._sender_source$.subscribe();
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
