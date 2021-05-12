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

  // #region 消息定义
  // private _commonRelationSender: Subject<BsnRelativesMessageModel>;
  // /**
  //  * 通用消息发送者
  //  */
  // public get commonRelationSender(): Subject<BsnRelativesMessageModel> {
  //     return this._commonRelationSender;
  // }
  // public set commonRelationSender(value: Subject<BsnRelativesMessageModel>) {
  //     this._commonRelationSender = value;
  // }
  // private _commonRelationReceiver: Subject<BsnRelativesMessageModel>;
  // /**
  //  * 通用消息接收者
  //  */
  // public get commonRelationReceiver(): Subject<BsnRelativesMessageModel> {
  //     return this._commonRelationReceiver;
  // }
  // public set commonRelationReceiver(value: Subject<BsnRelativesMessageModel>) {
  //     this._commonRelationReceiver = value;
  // }
  // private _behavoirRelationSender: BehaviorSubject<BsnRelativesMessageModel>;
  // /**
  //  * 延迟消息发送者
  //  */
  // public get behavoirRelationSender(): BehaviorSubject<BsnRelativesMessageModel> {
  //     return this._behavoirRelationSender;
  // }
  // public set behavoirRelationSender(value: BehaviorSubject<BsnRelativesMessageModel>) {
  //     this._behavoirRelationSender = value;
  // }
  // private _behavoirRelationReceiver: BehaviorSubject<BsnRelativesMessageModel>;
  // /**
  //  * 延迟消息接收者
  //  */
  // public get behavoirRelationReceiver(): BehaviorSubject<BsnRelativesMessageModel> {
  //     return this._behavoirRelationReceiver;
  // }
  // public set behavoirRelationReceiver(value: BehaviorSubject<BsnRelativesMessageModel>) {
  //     this._behavoirRelationReceiver = value;
  // }

  /**
   * 注销接收者与发送者
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

  // 获取配置
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
              // 判断是否时主页面配置,如果是主页面配置,则直接进行页面解析
              if (key === customConfigId) {
                //  this.config = pageJson[customConfigId]['layoutJson'];
                // liu 20.11.12
                this.setCache(key, 'mainPage', pageJson[key].config, pageJson[key].permission);
              } else {
                // 将子页面的配置加入缓存, 后期使用子页面数据时直接从缓存中获取

                this.setCache(key, 'childPage', pageJson[key].config, pageJson[key].permission);
              }
            }
          }
        }
      }
    } else {
      const response = await this._componentService.apiService
        .post('resource/B_P_C_CONFIG_PAGE_ALL/operate', { PAGE_CODE: customConfigId })
        .toPromise();

      if (response && response.data) {
        if (response.data._procedure_resultset_1[0].W === '') {
          // this.config = null;
        } else {
          const pageJson = JSON.parse(response.data._procedure_resultset_1[0].W);
          for (const key in pageJson) {
            if (pageJson.hasOwnProperty(key)) {
              // 判断是否时主页面配置,如果是主页面配置,则直接进行页面解析
              if (key === customConfigId) {
                //  this.config = pageJson[customConfigId]['layoutJson'];
                // liu 20.11.12
                this.setCache(key, 'childPage', pageJson[customConfigId], null);
              } else {
                // 将子页面的配置加入缓存, 后期使用子页面数据时直接从缓存中获取

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

  // 写入缓存
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
        // 组件信息
        page_config_data[json.id] = json;
      });
    }

    const componentsPermissionJson = permissionData;
    if (Array.isArray(componentsPermissionJson) && componentsPermissionJson.length > 0) {
      componentsPermissionJson.forEach((json) => {
        // 组件信息
        page_permission_data[json.id] = json;
      });
    }

    const activeMenu: any = this._componentService.cacheService.getNone('activeMenu');
    // 2.从当前缓存下查找当前menu的配置集合
    const menuId = activeMenu.id;
    let activeConfig: any = this._componentService.cacheService.getNone('menuId');
    // 3.层级是否控制在布局页面结构
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

    // 将缓存数据写入
    pageConfigCache[menuId].pageConfig = { ...pageConfigCache[menuId].pageConfig, ...page_config_data };
    pageConfigCache[menuId].permissionConfig = { ...pageConfigCache[menuId].permissionConfig, ...page_permission_data };
    // this._componentService.cacheService.set(menuId,activeConfig);
    return true;
  }

  // 获取当前组件配置（从缓存读取组件信息）
  public getMenuComponentConfigById(id): any {
    // 1.加载当前menu下的缓存信息
    const activeMenu: any = this._componentService.cacheService.getNone('activeMenu');
    // 2.从当前缓存下查找当前menu的配置集合
    const menuId = activeMenu.id;
    // const activeConfig = this._componentService.cacheService.getNone(menuId);
    // 3.层级是否控制在布局页面结构
    // this.layoutId  布局页面id 也就是子页标识
    // activeConfig= {pageConfig:{},permissionConfig:{}};
    // 4.从当前menu配置集合中查找相应组件的详细配置信息
    let componentConfig = null;
    if (pageConfigCache[menuId].pageConfig[id]) {
      componentConfig = CommonUtils.deepCopy(pageConfigCache[menuId].pageConfig[id]);
    }
    return componentConfig;
  }

  // 获取当前组件权限配置（从缓存读取组件权限信息）
  public getMenuComponentPermissionConfigById(id): any {
    // 1.加载当前menu下的缓存信息
    const activeMenu: any = this._componentService.cacheService.getNone('activeMenu');
    // 2.从当前缓存下查找当前menu的配置集合
    const menuId = activeMenu.id;
    // const activeConfig = this._componentService.cacheService.getNone(menuId);
    // 3.层级是否控制在布局页面结构
    // this.layoutId  布局页面id 也就是子页标识
    // activeConfig= {pageConfig:{},permissionConfig:{}};
    // 4.从当前menu配置集合中查找相应组件的详细配置信息
    let componentConfig = null;
    if (pageConfigCache[menuId].permissionConfig && pageConfigCache[menuId].permissionConfig[id]) {
      componentConfig = CommonUtils.deepCopy(pageConfigCache[menuId].permissionConfig[id]);
    }
    return componentConfig;
  }

  // 更新组件配置
  public setMergeConfig(id, _config) {
    // 1.加载当前menu下的缓存信息
    const activeMenu: any = this._componentService.cacheService.getNone('activeMenu');
    // 2.从当前缓存下查找当前menu的配置集合
    const menuId = activeMenu.id;
    // const activeConfig = this._componentService.cacheService.getNone(menuId);
    // 3.层级是否控制在布局页面结构
    // this.layoutId  布局页面id 也就是子页标识
    // activeConfig= {pageConfig:{},permissionConfig:{}};
    // 4.从当前menu配置集合中查找相应组件的详细配置信息
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
   *  【新型异步请求】
   * @param ajaxConfig
   * @param data
   * @param method  默认值 buildParameters 是执行构建参数的方法名称
   * @param option  特殊处理，数据表格参数的构建
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

    // 获取到参数结果
    let parameterResult = this.buildParameters_More(param_data, data, false, method, option);

    let _data = await this.buildAjax_More(parameterResult, ajaxConfig);
    let back_data: any;
    if (ajaxConfig['enableResultData']) {
      // 如果是系统内置，需要对其系统内置的结果集映射配置
      back_data = this.analysis_Data(_data, ajaxConfig.resultData);
    } else {
      back_data = _data;
    }

    //console.log('==========================================');
    //console.log('$---要求--$:', ajaxConfig);
    //console.log('$---返回--$:', back_data);
    return back_data;
  }

  public buildParameters_More(paramsCfg, data?, isArray = false, method?, option?) {
    // 根据 paramsCfg 解析数据 参数为

    // 分批次调用参数解析
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
    //============地址=============
    // console.log('替换后地址', url);
    //============头参数==========
    // let heads = new HttpHeaders();
    let heads = new HttpHeaders(backData['headParams']);
    // for (let key in backData['headParams']) {
    //   heads.set(key, backData['headParams'][key]);
    // }
    //console.log('=头参数==', heads);
    //==========查询参数==========
    let queryParam = backData['queryParams'];
    //==========请求体参数==========
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
        enableResultDataMore: true, // 是否启用自定义结果映射
        resultDataType: {
          name: 'list_obj',
          title: '数据集转对象',
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

    // 解析出当前数据
    if (result['dataProperties']) {
      switch (result['dataProperties']['dataType']) {
        case 'OBJECT':
          // 执行代码块 1
          backInfo = {};
          break;
        case 'ARRAY':
          // 执行代码块 1
          backInfo = [];
          break;
        case 'VALUE':
          // 执行代码块 1
          break;
      }
    }

    // 是否启用赋值
    if (result['enableGetValue']) {
      if (result.hasOwnProperty('getValueConfig')) {
        // path: '{}root/:shux/$0/[]d',
        backInfo = this.analysis_path(param_data, result['getValueConfig']['path']);
        // 执行替换方案【当值不满足条件时】
      }
    } else {
      if (result.hasOwnProperty('defalutValue')) {
        // 可将字符串对象、数组转为值
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
    let path_strs: any[]; // 定义一数组
    path_strs = path.split('/');
    // 依照层级解析

    let _data: any;
    let _isPass = true;
    for (let _index = 0; _index < path_strs.length; _index++) {
      if (!_isPass) {
        break;
      }
      const _indexStr = path_strs[_index];
      if (_indexStr.indexOf('~') > -1) {
        // 根
        _data = data;
      }
      if (_indexStr.indexOf('{}') > -1) {
        // 对象

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
        // 数组

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
        // 属性

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
        // 索引
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
        // 当前位置的上一级【目前不实现】
      }
    }
    //  console.log('原始数据:', param_data, '地址:', path, '最终解析出:', _data);

    return _data;
  }

  // 复杂结构 解析参数
  public ComplexStructure() {
    let p = [
      {
        name: 'a',
        type: 'value',
        value: '',
        valueName: '',
        enableProperties: '', // 是否启用属性（子对象、数组描述）
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
