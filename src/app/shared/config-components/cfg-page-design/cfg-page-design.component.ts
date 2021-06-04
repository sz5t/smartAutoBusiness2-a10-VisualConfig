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
  layoutTree = [];

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
    this._initInnerValue();
    this.setChangeValue(this.changeValue);
    this.load();
    this.fromDataService.selectedItem = this.selectedItem;

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

  loadJson() {
    this.load();
  }
  async load() {
    let load_config = {
      "id": "tree_add_func",
      "url": "resource/SMT_SETTING_LAYOUT/query",
      "urlType": "inner",
      "ajaxType": "get",
      "params": [
        {
          "name": "ID",
          "type": "tempValue",
          "valueName": "ID"

        }
      ]
    }
    this.config['loadingConfig'] = load_config;
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

    if (response.data && response.data.length > 0) {
      const backjosn = response.data[0]['JSON'];
      if (backjosn) {
        const pageJosn = JSON.parse(backjosn);
        this.layoutTree = pageJosn['layoutJson'];
        this.fromDataService.layoutSourceData = pageJosn['componentsJson'];
      } else {
        this.layoutTree = [];
        this.fromDataService.layoutSourceData = {};
      }


    }



    console.log('===可视化页面加载===', response)
  }
  public buildParameters(paramsCfg, data?, isArray = false) {
    let parameterResult: any | any[];
    if (!isArray && !data) {
      parameterResult = ParameterResolver.resolve({
        params: paramsCfg,
        tempValue: this.tempValue,
        componentValue: this.getComponentValue(),
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

  getComponentValue() {
    let obj = {};
    let configjson = {};
    if (this.fromDataService.layoutTreeInstance) {
      configjson = {
        layoutJson: this.fromDataService.layoutTreeInstance['layoutTree'],
        componentsJson: this.fromDataService.layoutSourceData
      }
    }
    obj['configjson'] = configjson;
    return obj;

  }

  createMessageInfo(type: string, messageInfo: string): void {
    this.componentService.msgService.create(type, `${messageInfo}`);
  }


  async saveJson() {
    console.log('保存json', this.tempValue, this.fromDataService);
    console.log('保存json 页面结构树', this.fromDataService.layoutTreeInstance['layoutTree'])

    console.log('页面最终结构', this.getComponentValue());
    if (!this.tempValue["ID"]) {
      this.createMessageInfo('warning', '未指定页面，不能保存');
      return;
    }
    let save_config = {
      "id": "tree_add_func",
      "url": "resource/SMT_SETTING_LAYOUT/update",
      "urlType": "inner",
      "ajaxType": "post",
      "params": [
        {
          "name": "ID",
          "type": "tempValue",
          "valueName": "ID"

        },
        {
          "name": "JSON",
          "type": "componentValue",
          "valueName": "configjson"
        }
      ]
    }

    const url = save_config.url;
    const method = save_config.ajaxType;

    const params = {
      ...this.buildParameters(save_config.params)
    };

    // const response: any = await this.componentService.apiService[method](url, method, { params }).toPromise();
    let response = await this.executeHttpRequest(url, method, params).toPromise();
    if (response && response['success'] === 1) {
      this.createMessageInfo('success', '保存成功');
    } else {
      this.createMessageInfo('warning', `保存失败${response['error']}`);
    }

    console.log('保存结果', response);

  }

  /*
     1.加载配置
     2.生成布局结构
     3.递归结构
  */

}
