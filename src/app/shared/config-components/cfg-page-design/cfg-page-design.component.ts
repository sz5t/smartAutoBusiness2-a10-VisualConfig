import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, Inject, Input, OnInit } from '@angular/core';
import { NzTreeNodeOptions } from 'ng-zorro-antd/tree';
import { BSN_COMPONENT_SERVICES } from 'src/app/core/relations/bsn-relatives';
import { ComponentServiceProvider } from 'src/app/core/services/components/component.service';
import { configFormDataServerService } from 'src/app/core/services/config/form-data.service';
import { CnComponentBase } from '../../components/cn-component.base';
import { ParameterResolver } from '../../resolver/parameter/parameter.resolver';

@Component({
  selector: 'app-cfg-page-design',
  templateUrl: './cfg-page-design.component.html',
  styles: [
  ],
  providers: [configFormDataServerService]
})
export class CfgPageDesignComponent extends CnComponentBase implements OnInit {
  @Input() public config;
  @Input() changeValue: any;
  @Input() initData;
  @Input() tempData;


  style1 = { "height": (window.document.body.clientHeight - 160).toString() + 'px', "max-height": (window.document.body.clientHeight - 160).toString() + 'px', "overflow": "auto" }
  selectedItem: any = { item: null, active: null };
  layout_nodes: NzTreeNodeOptions[];
  showLayout = true;
  constructor(public fromDataService: configFormDataServerService, private httpClient: HttpClient,
    @Inject(BSN_COMPONENT_SERVICES)
    public componentService: ComponentServiceProvider,) {
    super(componentService);
  }
  ngOnInit(): void {
    this.setChangeValue(this.changeValue);

  }

  async load() {
    if (!this.config.loadingConfig) {
      return;
    }
    let response: any;
    if (this.config.loadingConfig['enableAjaxMore']) {
      response = await this.executeHttpMore(this.config.loadingConfig, {}, 'buildParameters', null);

    } else {
      const url = this.config.loadingConfig.url;
      const method = this.config.loadingConfig.method ? this.config.loadingConfig.method : this.config.loadingConfig.ajaxType;

      const params = {
        ...this.buildParameters(this.config.loadingConfig.params)
      };

      // const response: any = await this.componentService.apiService[method](url, method, { params }).toPromise();
      response = await this.executeHttpRequest(url, method, params).toPromise();
    }
    if (response && response.data.hasOwnProperty('_procedure_resultset_1')) {
      response.data['resultDatas'] = response.data['_procedure_resultset_1'];
    }
  }
  public buildParameters(paramsCfg, data?, isArray = false) {
    let parameterResult: any | any[];
    if (!isArray && !data) {
      parameterResult = ParameterResolver.resolve({
        params: paramsCfg,
        tempValue: this.tempValue,
        //  componentValue: this.COMPONENT_VALUE,
        item: data,
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
        //componentValue: this.COMPONENT_VALUE,
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
    }
    return parameterResult;
  }
  public executeHttpRequest(url, method, paramData, logInfo?: any): any {
    let _header = {};
    if (logInfo) {
      const logInfoStr = JSON.stringify(logInfo);
      const dd = encodeURI(logInfoStr);
      _header = new HttpHeaders({
        _log: dd,
      });
    }
    switch (method) {
      case 'get':
        return this.componentService.apiService[method](url, paramData, { headers: _header });
      default:
        return this.componentService.apiService[method](url, paramData, {}, { headers: _header });
    }
  }

  public getCurrentComponentId() {
    return this.config.id;
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

}
