import { Observable, Subscription } from 'rxjs';
import { ComponentServiceProvider } from 'src/app/core/services/components/component.service';
import { environment } from '@env/environment';
import { pageConfigCache } from '@env/page-config-cache';
import { CommonUtils } from 'src/app/core/utils/common-utils';
import { HttpHeaders } from '@angular/common/http';

export interface InnerValue {
  tempValue: any;
  initValue: any;
  cacheValue: any;
}

export interface ICommonOperations {
  beforeOperations(config: any): Observable<any>;
  operations(config: any): Observable<any>;
  afterOperations(config: any): Observable<any>;
}

export class CnComponentBase {
  private _initValue: any;
  public get initValue(): any {
    return this._initValue ? this._initValue : {};
  }
  public set initValue(value: any) {
    this._initValue = value;
  }
  private _tempValue: any;
  public get tempValue(): any {
    return this._tempValue ? this._tempValue : {};
  }
  public set tempValue(value: any) {
    this._tempValue = value;
  }
  private _cacheValue: any;
  public get cacheValue(): any {
    return this._cacheValue ? this._cacheValue : {};
  }
  public set cacheValue(value: any) {
    this._cacheValue = value;
  }
  private _routerValue: any;
  public get routerValue(): any {
    return this._routerValue ? this._routerValue : {};
  }
  public set routerValue(value: any) {
    this._routerValue = value;
  }

  private _cascadeValue: any;
  public get cascadeValue(): any {
    return this._cascadeValue ? this._cascadeValue : {};
  }
  public set cascadeValue(value: any) {
    this._cascadeValue = value;
  }

  private _staticComponentValue: any;
  public get staticComponentValue(): any {
    return this._staticComponentValue ? this._staticComponentValue : {};
  }
  public set staticComponentValue(value: any) {
    this._staticComponentValue = value;
  }

  private _userValue: any;
  public get userValue(): any {
    return this._userValue ? this._userValue : {};
  }
  public set userValue(value: any) {
    this._userValue = value;
  }
  private _menuValue: any;
  public get menuValue(): any {
    return this._menuValue ? this._menuValue : {};
  }
  public set menuValue(value: any) {
    this._menuValue = value;
  }

  private _subscription$: Subscription;
  public get subscription$(): Subscription {
    return this._subscription$;
  }
  public set subscription$(value: Subscription) {
    this._subscription$ = value;
  }

  private _trigger_subscription$: Subscription;
  public get trigger_subscription$(): Subscription {
    return this._trigger_subscription$;
  }
  public set trigger_subscription$(value: Subscription) {
    this._trigger_subscription$ = value;
  }

  constructor(private _componentService: ComponentServiceProvider) {
    this.userValue = _componentService.cacheService.getNone('userInfo') ? _componentService.cacheService.getNone('userInfo') : {};
  }

  // #region ????????????
  // private _commonRelationSender: Subject<BsnRelativesMessageModel>;
  // /**
  //  * ?????????????????????
  //  */
  // public get commonRelationSender(): Subject<BsnRelativesMessageModel> {
  //     return this._commonRelationSender;
  // }
  // public set commonRelationSender(value: Subject<BsnRelativesMessageModel>) {
  //     this._commonRelationSender = value;
  // }
  // private _commonRelationReceiver: Subject<BsnRelativesMessageModel>;
  // /**
  //  * ?????????????????????
  //  */
  // public get commonRelationReceiver(): Subject<BsnRelativesMessageModel> {
  //     return this._commonRelationReceiver;
  // }
  // public set commonRelationReceiver(value: Subject<BsnRelativesMessageModel>) {
  //     this._commonRelationReceiver = value;
  // }
  // private _behavoirRelationSender: BehaviorSubject<BsnRelativesMessageModel>;
  // /**
  //  * ?????????????????????
  //  */
  // public get behavoirRelationSender(): BehaviorSubject<BsnRelativesMessageModel> {
  //     return this._behavoirRelationSender;
  // }
  // public set behavoirRelationSender(value: BehaviorSubject<BsnRelativesMessageModel>) {
  //     this._behavoirRelationSender = value;
  // }
  // private _behavoirRelationReceiver: BehaviorSubject<BsnRelativesMessageModel>;
  // /**
  //  * ?????????????????????
  //  */
  // public get behavoirRelationReceiver(): BehaviorSubject<BsnRelativesMessageModel> {
  //     return this._behavoirRelationReceiver;
  // }
  // public set behavoirRelationReceiver(value: BehaviorSubject<BsnRelativesMessageModel>) {
  //     this._behavoirRelationReceiver = value;
  // }

  /**
   * ???????????????????????????
   */
  public unsubscribeRelation() {
    if (this.subscription$) {
      this.subscription$.unsubscribe();
    }
    if (this.trigger_subscription$) {
      this.trigger_subscription$.unsubscribe();
    }
  }

  // #endregion

  public asyncBefore(target, method, advice) {
    const original = target[method];
    target[method] = async (...args) => {
      const result = await advice(args);
      if (result) {
        original.apply(target, args);
      }
    };
    return target;
  }

  public asyncAfter(target, method, advice) {
    const original = target[method];
    target[method] = async (...args) => {
      const result = await original.apply(target, args);
      if (result) {
        advice(args);
      }
    };
  }

  public before(target, method, advice) {
    const original = target[method];
    target[method] = (...args) => {
      const result = advice(args);
      if (result) {
        original.apply(target, args);
      }
    };
    return target;
  }

  public after(target, method, advice) {
    const original = target[method];
    target[method] = (...args) => {
      original.apply(target, args) && advice(args);
    };
    return target;
  }

  public around(target, method, advice) {
    const original = target[method];
    target[method] = (...args) => {
      advice(args);
      original.apply(target, args);
      advice(args);
    };
    return target;
  }

  public asyncBeforeLog(target, method, advice) {
    const original = target[method];
    target[method] = async (...args) => {
      const result = await advice(target, args);
      if (result) {
        original.apply(target, args);
      }
    };
    return target;
  }

  public beforeLog(target, method, advice) {
    const original = target[method];
    target[method] = (...args) => {
      const result = advice(target, args);
      original.apply(target, args);
    };
    return target;
  }

  public confirm(confirmCfg, callback) {
    const confirmOptional = {
      nzTitle: confirmCfg.title ? confirmCfg.title : '',
      nzContent: confirmCfg.content ? confirmCfg.content : '',
      nzCancelText: confirmCfg.cancelText ? confirmCfg.cancelText : 'cancel',
      nzOkText: confirmCfg.okText ? confirmCfg.okText : 'OK',
      nzOnOk: () => {
        if (callback) {
          callback();
        }
      },
    };
    this._componentService.modalService.confirm(confirmOptional);
  }

  public dialog(option) {
    console.log(option);
  }

  public createMessage() {
    const messageOptional = {};
    this._componentService.modalService.create(messageOptional);
  }

  // ????????????
  public async getCustomConfig(customConfigId?) {
    if (environment.systemSettings && environment.systemSettings.systemMode === 'work') {
      let page_url = 'resource/B_P_C_CONFIG_PAGE_ALL_NEW/operate';
      let page_params = { PageId: customConfigId };
      if (environment.systemSettings && environment.systemSettings.permissionInfo.enableOperatePermission) {
        const work_Page = environment.systemSettings.pageInfo.workPageInfo.pageAjaxConfig;
        page_url = work_Page.url;
        const d_params = { PageId: customConfigId };
        page_params = this.buildParametersByPage(work_Page.params, d_params);
      } else {
        page_url = 'resource/B_P_C_CONFIG_PAGE_ALL_NEW/operate';
        page_params = { PageId: customConfigId };
      }

      const response = await this._componentService.apiService.post(page_url, page_params).toPromise();

      if (response && response.data) {
        if (response.data._procedure_resultset_1[0].W === '') {
          // this.config = null;
        } else {
          const pageJson = JSON.parse(response.data._procedure_resultset_1[0].W);
          for (const key in pageJson) {
            if (pageJson.hasOwnProperty(key)) {
              // ??????????????????????????????,????????????????????????,???????????????????????????
              if (key === customConfigId) {
                //  this.config = pageJson[customConfigId]['layoutJson'];
                // liu 20.11.12
                this.setCache(key, 'mainPage', pageJson[key].config, pageJson[key].permission);
              } else {
                // ?????????????????????????????????, ??????????????????????????????????????????????????????

                this.setCache(key, 'childPage', pageJson[key].config, pageJson[key].permission);
              }
            }
          }
        }
      }
    } else {
      const response = await this._componentService.apiService
        .post('resource/B_P_C_CONFIG_PAGE_ALL/operate', { PageId: customConfigId })
        .toPromise();

      if (response && response.data) {
        if (response.data._procedure_resultset_1[0].W === '') {
          // this.config = null;
        } else {
          const pageJson = JSON.parse(response.data._procedure_resultset_1[0].W);
          for (const key in pageJson) {
            if (pageJson.hasOwnProperty(key)) {
              // ??????????????????????????????,????????????????????????,???????????????????????????
              if (key === customConfigId) {
                //  this.config = pageJson[customConfigId]['layoutJson'];
                // liu 20.11.12
                this.setCache(key, 'childPage', pageJson[customConfigId], null);
              } else {
                // ?????????????????????????????????, ??????????????????????????????????????????????????????

                this.setCache(key, 'childPage', pageJson[key], null);
              }
            }
          }
        }
      }
    }
  }

  public buildParametersByPage(params?, data?): any {
    const userInfo = this._componentService.cacheService.getNone('userInfo');
    const activeMenu = this._componentService.cacheService.getNone('activeMenu');
    const paramsData = {};
    params.forEach((element) => {
      let valueItem: any;
      if (element.type === 'userValue') {
        valueItem = userInfo[element.valueName];
      }
      if (element.type === 'item') {
        valueItem = data[element.valueName];
      }
      if (element.type === 'activeMenu') {
        valueItem = activeMenu[element.valueName];
      }
      if (element.type === 'value') {
        valueItem = element.value;
      }

      if (!valueItem && valueItem !== 0) {
        valueItem = element.value;
      }

      paramsData[element.name] = valueItem;
    });
    return paramsData;
  }

  // ????????????
  public setCache(layoutId?, type?, configData?, permissionData?): any {
    const page_config_data = {};
    const page_permission_data = {};

    if (configData.layoutJson) {
      page_config_data[layoutId] = configData.layoutJson;
    } else {
      page_config_data[layoutId] = configData;
    }

    const componentJson = configData.componentsJson;
    if (Array.isArray(componentJson) && componentJson.length > 0) {
      componentJson.forEach((json) => {
        // ????????????
        page_config_data[json.id] = json;
      });
    }

    const componentsPermissionJson = permissionData;
    if (Array.isArray(componentsPermissionJson) && componentsPermissionJson.length > 0) {
      componentsPermissionJson.forEach((json) => {
        // ????????????
        page_permission_data[json.id] = json;
      });
    }

    const activeMenu: any = this._componentService.cacheService.getNone('activeMenu');
    // 2.??????????????????????????????menu???????????????
    const menuId = activeMenu.id;
    let activeConfig: any = this._componentService.cacheService.getNone('menuId');
    // 3.???????????????????????????????????????
    if (!activeConfig) {
      activeConfig = { pageConfig: {}, permissionConfig: {} };
    }
    if (!activeConfig.pageConfig) {
      activeConfig.pageConfig = {};
    }
    if (!activeConfig.permissionConfig) {
      activeConfig.permissionConfig = {};
    }

    if (activeConfig.pageConfig) {
      activeConfig.pageConfig = { ...activeConfig.pageConfig, ...page_config_data };
    }
    if (activeConfig.permissionConfig) {
      activeConfig.permissionConfig = { ...activeConfig.permissionConfig, ...page_permission_data };
    }

    // ?????????????????????
    pageConfigCache[menuId].pageConfig = { ...pageConfigCache[menuId].pageConfig, ...page_config_data };
    pageConfigCache[menuId].permissionConfig = { ...pageConfigCache[menuId].permissionConfig, ...page_permission_data };
    // this._componentService.cacheService.set(menuId,activeConfig);
    return true;
  }

  // ?????????????????????????????????????????????????????????
  public getMenuComponentConfigById(id): any {
    // 1.????????????menu??????????????????
    const activeMenu: any = this._componentService.cacheService.getNone('activeMenu');
    // 2.??????????????????????????????menu???????????????
    const menuId = activeMenu.id;
    // const activeConfig = this._componentService.cacheService.getNone(menuId);
    // 3.???????????????????????????????????????
    // this.layoutId  ????????????id ?????????????????????
    // activeConfig= {pageConfig:{},permissionConfig:{}};
    // 4.?????????menu??????????????????????????????????????????????????????
    let componentConfig = null;
    if (pageConfigCache[menuId].pageConfig[id]) {
      componentConfig = CommonUtils.deepCopy(pageConfigCache[menuId].pageConfig[id]);
    }
    return componentConfig;
  }

  // ?????????????????????????????????????????????????????????????????????
  public getMenuComponentPermissionConfigById(id): any {
    // 1.????????????menu??????????????????
    const activeMenu: any = this._componentService.cacheService.getNone('activeMenu');
    // 2.??????????????????????????????menu???????????????
    const menuId = activeMenu.id;
    // const activeConfig = this._componentService.cacheService.getNone(menuId);
    // 3.???????????????????????????????????????
    // this.layoutId  ????????????id ?????????????????????
    // activeConfig= {pageConfig:{},permissionConfig:{}};
    // 4.?????????menu??????????????????????????????????????????????????????
    let componentConfig = null;
    if (pageConfigCache[menuId].permissionConfig && pageConfigCache[menuId].permissionConfig[id]) {
      componentConfig = CommonUtils.deepCopy(pageConfigCache[menuId].permissionConfig[id]);
    }
    return componentConfig;
  }

  // ??????????????????
  public setMergeConfig(id, _config) {
    // 1.????????????menu??????????????????
    const activeMenu: any = this._componentService.cacheService.getNone('activeMenu');
    // 2.??????????????????????????????menu???????????????
    const menuId = activeMenu.id;
    // const activeConfig = this._componentService.cacheService.getNone(menuId);
    // 3.???????????????????????????????????????
    // this.layoutId  ????????????id ?????????????????????
    // activeConfig= {pageConfig:{},permissionConfig:{}};
    // 4.?????????menu??????????????????????????????????????????????????????
    let componentConfig = null;
    if (pageConfigCache[menuId].pageConfig[id]) {
      pageConfigCache[menuId].pageConfig[id] = _config;
    }
    return componentConfig;
  }

  /**
   * ajax_liu
   */
  public ajax_liu() {
    console.log('========>>>>>', this);
  }

  /**
   *  ????????????????????????
   * @param ajaxConfig
   * @param data
   * @param method  ????????? buildParameters ????????????????????????????????????
   * @param option  ??????????????????????????????????????????
   */
  public async executeHttpMore(ajaxConfig?, data?, method = 'buildParameters', option = '') {
    const ParamsList = [
      { name: 'headParams' },
      { name: 'pathParams' },
      { name: 'queryParams' },
      { name: 'bodyParams' },
      { name: 'params' },
    ];
    let param_data = {};
    ParamsList.forEach((item) => {
      param_data[item['name']] = ajaxConfig[item['name']] ? ajaxConfig[item['name']] : [];
    });

    // ?????????????????????
    let parameterResult = this.buildParameters_More(param_data, data, false, method, option);

    let _data = await this.buildAjax_More(parameterResult, ajaxConfig);
    let back_data: any;
    if (ajaxConfig['enableResultData']) {
      // ????????????????????????????????????????????????????????????????????????
      back_data = this.analysis_Data(_data, ajaxConfig.resultData);
    } else {
      back_data = _data;
    }

    //console.log('==========================================');
    //console.log('$---??????--$:', ajaxConfig);
    //console.log('$---??????--$:', back_data);
    return back_data;
  }

  public buildParameters_More(paramsCfg, data?, isArray = false, method?, option?) {
    // ?????? paramsCfg ???????????? ?????????

    // ???????????????????????????
    let parameterResult: any = {};
    for (let k in paramsCfg) {
      let paramsCfgItem = paramsCfg[k];

      if (k === 'queryParams' && option === 'paging') {
        parameterResult[k] = {
          ...this[method](paramsCfgItem, data, isArray),
          ...this['_buildPaging'](),
          ...this['_buildSort'](),
        };
      } else {
        parameterResult[k] = this[method](paramsCfgItem, data, isArray);
      }
    }
    return parameterResult;
  }

  public async buildAjax_More(backData?, ajaxConfig?) {
    debugger;
    let ajaxType = ajaxConfig.ajaxType;
    let url = ajaxConfig['url'];
    for (let key in backData['pathParams']) {
      url = url.replace(new RegExp('\\{' + key + '\\}', 'g'), backData['pathParams'][key]);
    }
    //============??????=============
    // console.log('???????????????', url);
    //============?????????==========
    // let heads = new HttpHeaders();
    let heads = new HttpHeaders(backData['headParams']);
    // for (let key in backData['headParams']) {
    //   heads.set(key, backData['headParams'][key]);
    // }
    //console.log('=?????????==', heads);
    //==========????????????==========
    let queryParam = backData['queryParams'];
    //==========???????????????==========
    let bodyParam = backData['bodyParams'];

    if (ajaxType === 'post' || ajaxType === 'put') {
      return await this._componentService.apiService[ajaxType](url, bodyParam, queryParam, { headers: heads }).toPromise();
    }
    if (ajaxType === 'get' || ajaxType === 'delete') {
      return await this._componentService.apiService[ajaxType](url, queryParam, { headers: heads }).toPromise();
    } else {
      return await this._componentService.apiService[ajaxType](url, bodyParam, queryParam, { headers: heads }).toPromise();
    }
  }

  public analysis_Data(param_data?, resultConfig?) {
    let data = JSON.parse(JSON.stringify(param_data));
    let backInfo: any;
    let dd = {
      resultData: {
        enableResultDataMore: true, // ?????????????????????????????????
        resultDataType: {
          name: 'list_obj',
          title: '??????????????????',
        },
        resultDataMore: {},
      },
    };

    let result: any;

    if (resultConfig['enableResultDataMore']) {
      if (resultConfig.hasOwnProperty('resultDataType')) {
        if (environment['resultDataRule']) {
          result = environment['resultDataRule'][resultConfig['resultDataType']['name']];
        }
      }
    } else {
      if (resultConfig.hasOwnProperty('resultDataMore')) {
        result = resultConfig['resultDataMore'];
      }
    }

    if (!result) {
      result = {};
      backInfo = data;
      return backInfo;
    }

    // ?????????????????????
    if (result['dataProperties']) {
      switch (result['dataProperties']['dataType']) {
        case 'OBJECT':
          // ??????????????? 1
          backInfo = {};
          break;
        case 'ARRAY':
          // ??????????????? 1
          backInfo = [];
          break;
        case 'VALUE':
          // ??????????????? 1
          break;
      }
    }

    // ??????????????????
    if (result['enableGetValue']) {
      if (result.hasOwnProperty('getValueConfig')) {
        // path: '{}root/:shux/$0/[]d',
        backInfo = this.analysis_path(param_data, result['getValueConfig']['path']);
        // ????????????????????????????????????????????????
      }
    } else {
      if (result.hasOwnProperty('defalutValue')) {
        // ???????????????????????????????????????
        // var test = '{ colkey: "col", colsinfo: "NameList" }'
        // var obj2 = eval("(" + test + ")");
        backInfo = result['defalutValue'];
      }
    }

    if (result.hasOwnProperty('objectProperties')) {
      let objectProperties = result['objectProperties'];
      objectProperties['setProperties'].forEach((element) => {
        backInfo[element['name']] = this.analysis_Data(data, element);
      });
      objectProperties['removeProperties'].forEach((element) => {
        if (backInfo && backInfo.hasOwnProperty(element['name'])) {
          delete backInfo[element['name']];
        }
      });
    }

    return backInfo;
  }

  public analysis_path(param_data?, path?) {
    let data = JSON.parse(JSON.stringify(param_data));
    let path_strs: any[]; // ???????????????
    path_strs = path.split('/');
    // ??????????????????

    let _data: any;
    let _isPass = true;
    for (let _index = 0; _index < path_strs.length; _index++) {
      if (!_isPass) {
        break;
      }
      const _indexStr = path_strs[_index];
      if (_indexStr.indexOf('~') > -1) {
        // ???
        _data = data;
      }
      if (_indexStr.indexOf('{}') > -1) {
        // ??????

        const obj_str = _indexStr.split('{}');
        if (obj_str.length < 2) {
          _isPass = false;
        }
        if (_isPass) {
          let object_name = obj_str[1];
          _data = _data[object_name];
        }
      }
      if (_indexStr.indexOf('[]') > -1) {
        // ??????

        const arry_str = _indexStr.split('[]');
        if (arry_str.length < 2) {
          _isPass = false;
        }
        if (_isPass) {
          let arry_name = arry_str[1];
          _data = _data[arry_name];
        }
      }
      if (_indexStr.indexOf(':') > -1) {
        // ??????

        const attr_str = _indexStr.split(':');
        if (attr_str.length < 2) {
          _isPass = false;
        }
        if (_isPass) {
          let attr_name = attr_str[1];
          _data = _data[attr_name];
        }
      }
      if (_indexStr.indexOf('$') > -1) {
        // ??????
        const index_str = _indexStr.split('$');
        if (index_str.length < 2) {
          _isPass = false;
        }
        const _arr_index = parseInt(index_str[1]);
        if (_data && _data.length > _arr_index) {
          _data = _data[_arr_index];
        } else {
          _isPass = false;
        }
      }
      if (_indexStr.indexOf('..') > -1) {
        // ?????????????????????????????????????????????
      }
    }
    //  console.log('????????????:', param_data, '??????:', path, '???????????????:', _data);

    return _data;
  }

  // ???????????? ????????????
  public ComplexStructure() {
    let p = [
      {
        name: 'a',
        type: 'value',
        value: '',
        valueName: '',
        enableProperties: '', // ????????????????????????????????????????????????
        objectProperties: [
          {
            name: 'a',
            type: 'value',
            value: '',
            valueName: '',
          },
        ],
      },
    ];
  }
}
