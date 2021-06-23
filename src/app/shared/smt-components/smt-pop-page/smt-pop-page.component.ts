import { Component, ComponentFactoryResolver, ComponentRef, Inject, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { BSN_COMPONENT_SERVICES } from 'src/app/core/relations/bsn-relatives';
import { ComponentServiceProvider } from 'src/app/core/services/components/component.service';
import { SmtComponentBase } from '../smt-component.base';
import { SmtDynamicPageComponent } from '../smt-dynamic-page/smt-dynamic-page.component';

@Component({
  selector: 'app-smt-pop-page',
  templateUrl: './smt-pop-page.component.html',
  styles: [
  ]
})
export class SmtPopPageComponent extends SmtComponentBase implements OnInit {

  parentDom: any;
  config: any;
  popPage: any;
  pageCode: any;
  pageInitData: any;

  // @ViewChild('popPage', { static: true }) public popPage: SmtDynamicPageComponent;
  private _layoutObj: ComponentRef<any>;
  constructor(@Inject(BSN_COMPONENT_SERVICES)
  public componentService: ComponentServiceProvider,
    private _container: ViewContainerRef,
    private _resolver: ComponentFactoryResolver,
  ) {
    super(componentService);
    this.CACHE_VALUE = this.componentService.cacheService;
    this.INIT_VALUE = {};
    this.TEMP_VALUE = {};
    this.COMPONENT_VALUE = {};

  }

  ngOnInit(): void {
    if (!this.pageCode) {
      this.pageCode = 'PAGE_TEST_FLOW_STUDENT_APPLY';
    }
    this.loadDynamicLayout(this.pageCode);
    console.log('poppage');

  }

  private loadDynamicLayout(pageCode: string) {
    // debugger;
    let page_url = 'smt-app/resource/SMT_SETTING_LAYOUT/query';
    let permission_url = 'smt-app/resource/GET_AUTH_LAYOUT_STRUCTURE_PERMISSION/query';
    let page_params = { PAGE_CODE: pageCode };
    const userInfo = this.CACHE_VALUE.getNone('userInfo');
    if (userInfo) {
      let permission_params = {
        PAGE_CODE: pageCode,
        ROLE_CODE: userInfo['roles'].join(','),
      };

      this.componentService.apiService.get(page_url, page_params).subscribe((response) => {
        if (response.state !== 1 || response.data === null || response.data === []) {
          this.config = null;
        } else {
          const pageJson = JSON.parse(response.data[0]['JSON']);
          this.componentService.apiService.get(permission_url, permission_params).subscribe((response: any) => {
            if (response && response.state === 1) {
              this.config = { pageJson: pageJson, permissionJson: response.data };
              this.buildLayout({ ...{ name: pageCode }, ...this.pageInitData });
            }
          });
        }
      });
    }
  }

  private buildLayout(params) {
    // console.log('buildLayout Receive message --', this.initValue, this.tempValue);
    const cmpt = this._resolver.resolveComponentFactory<any>(SmtDynamicPageComponent);
    this._container.clear();
    this._layoutObj = this._container.createComponent(cmpt);
    this._layoutObj.instance.config = this.config;
    if (params) {
      this._layoutObj.instance.initData = params;
    }
    this.popPage = this._layoutObj.instance;
  }

  close() {
    console.log(this.parentDom);
    this.parentDom.windowDialog.close();
  }

}
