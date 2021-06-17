import { APP_INITIALIZER, ModuleWithProviders, NgModule, Optional, SkipSelf } from '@angular/core';
import { StartupService, throwIfAlreadyLoaded } from '@core';
import { DelonMockModule } from '@delon/mock';
import { AlainThemeModule } from '@delon/theme';
import { AlainConfig, ALAIN_CONFIG } from '@delon/util';

import { NzConfig, NZ_CONFIG } from 'ng-zorro-antd/core/config';
import { Subject } from 'rxjs';
import {
  BSN_RELATION_TRIGGER,
  BsnRelativesMessageModel,
  BSN_RELATION_SUBJECT,
  BSN_RELATIVE_MESSAGE_SENDER,
  BSN_RELATIVE_MESSAGE_RECEIVER,
  BSN_RELATIVE_MESSAGE_BEHAVIOR_SENDER,
  BSN_RELATIVE_MESSAGE_BEHAVIOR_RECEIVER,
  BSN_COMPONENT_SERVICES,
  SMT_RELATION_SUBJECT,
  ISenderModel,
} from './core/relations/bsn-relatives';
import { ComponentServiceProvider } from './core/services/components/component.service';

// Please refer to: https://ng-alain.com/docs/global-config
// #region NG-ALAIN Config

import { ACLService, DelonACLModule } from '@delon/acl';

const alainConfig: AlainConfig = {
  st: { modal: { size: 'lg' } },
  pageHeader: { homeI18n: 'home' },
  lodop: {
    license: `A59B099A586B3851E0F0D7FDBF37B603`,
    licenseA: `C94CEE276DB2187AE6B65D56B3FC2848`,
  },
  auth: { login_url: `/passport/${environment.routeInfo.loginPath}` },
};

const alainModules = [AlainThemeModule.forRoot(), DelonACLModule.forRoot(), DelonMockModule.forRoot()];
const alainProvides = [{ provide: ALAIN_CONFIG, useValue: alainConfig }];

// mock
import { environment } from '@env/environment';
import * as MOCKDATA from '../../_mock';
import { StartupServiceFactory } from './app.module';
import { ApiService, ApiServiceConfiguration } from './core/services/api/api.service';
if (!environment.production) {
  alainConfig.mock = { data: MOCKDATA };
}

// #region reuse-tab
/**
 * 若需要[路由复用](https://ng-alain.com/components/reuse-tab)需要：
 * 1、在 `shared-delon.module.ts` 导入 `ReuseTabModule` 模块
 * 2、注册 `RouteReuseStrategy`
 * 3、在 `src/app/layout/default/default.component.html` 修改：
 *  ```html
 *  <section class="alain-default__content">
 *    <reuse-tab #reuseTab></reuse-tab>
 *    <router-outlet (activate)="reuseTab.activate($event)"></router-outlet>
 *  </section>
 *  ```
 */
// import { RouteReuseStrategy } from '@angular/router';
// import { ReuseTabService, ReuseTabStrategy } from '@delon/abc/reuse-tab';
// alainProvides.push({
//   provide: RouteReuseStrategy,
//   useClass: ReuseTabStrategy,
//   deps: [ReuseTabService],
// } as any);

// #endregion

// #endregion

// Please refer to: https://ng.ant.design/docs/global-config/en#how-to-use
// #region NG-ZORRO Config

const ngZorroConfig: NzConfig = {};

const zorroProvides = [{ provide: NZ_CONFIG, useValue: ngZorroConfig }];

const APPINIT_PROVIDES = [
  StartupService,
  ApiService,
  ApiServiceConfiguration,
  {
    provide: APP_INITIALIZER,
    useFactory: StartupServiceFactory,
    deps: [StartupService],
    multi: true,
  },
  ACLService,
];

const RELATIONS_PROVIDERS = [
  {
    provide: SMT_RELATION_SUBJECT,
    useValue: new Subject<ISenderModel>(),
  },
  {
    provide: BSN_RELATION_TRIGGER,
    useValue: new Subject<BsnRelativesMessageModel>(),
  },
  {
    provide: BSN_RELATION_SUBJECT,
    useValue: new Subject<BsnRelativesMessageModel>(),
  },
  {
    provide: BSN_RELATIVE_MESSAGE_SENDER,
    useValue: new Subject<BsnRelativesMessageModel>(),
  },
  {
    provide: BSN_RELATIVE_MESSAGE_RECEIVER,
    useValue: new Subject<BsnRelativesMessageModel>(),
  },
  {
    provide: BSN_RELATIVE_MESSAGE_BEHAVIOR_SENDER,
    useValue: new Subject<BsnRelativesMessageModel>(),
  },
  {
    provide: BSN_RELATIVE_MESSAGE_BEHAVIOR_RECEIVER,
    useValue: new Subject<BsnRelativesMessageModel>(),
  },
  {
    provide: BSN_COMPONENT_SERVICES,
    // tslint:disable-next-line: no-use-before-declare
    useClass: ComponentServiceProvider,
  },
];
// #endregion

@NgModule({
  imports: [...alainModules],
})
export class GlobalConfigModule {
  constructor(@Optional() @SkipSelf() parentModule: GlobalConfigModule) {
    throwIfAlreadyLoaded(parentModule, 'GlobalConfigModule');
  }

  static forRoot(): ModuleWithProviders<GlobalConfigModule> {
    return {
      ngModule: GlobalConfigModule,
      providers: [...alainProvides, ...zorroProvides, ...APPINIT_PROVIDES, ...RELATIONS_PROVIDERS],
    };
  }
}
