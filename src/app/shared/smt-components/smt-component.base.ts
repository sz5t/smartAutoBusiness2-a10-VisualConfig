import { HttpHeaders } from '@angular/common/http';
import { environment } from '@env/environment';
import { Subscription } from 'rxjs';
import { ComponentServiceProvider } from 'src/app/core/services/components/component.service';
import { SmtParameterResolver } from '../resolver/smt-parameter/smt-parameter-resolver';
import { IExecuteResult } from './smt-component.interface';

/**
 * 1、参数解析
 * 2、异步请求
 * 3、弹出窗体
 * 4、弹出消息
 * 5、弹出页面
 */
export class SmtComponentBase {
  constructor(public componentService: ComponentServiceProvider) { }
  //#region 组件公共属性定义

  private _IS_LOADING: boolean;
  public get IS_LOADING(): boolean {
    return this._IS_LOADING;
  }
  public set IS_LOADING(value: boolean) {
    this._IS_LOADING = value;
  }

  private _KEY_ID: string;
  public get KEY_ID(): string {
    return this._KEY_ID;
  }
  public set KEY_ID(value: string) {
    this._KEY_ID = value;
  }

  private _INIT_VALUE: any;
  /**
   * 初始化值变量
   */
  public get INIT_VALUE(): any {
    return this._INIT_VALUE;
  }
  public set INIT_VALUE(value: any) {
    this._INIT_VALUE = value;
  }

  private _TEMP_VALUE: any;
  /**
   * 组件内部临时变量
   */
  public get TEMP_VALUE(): any {
    return this._TEMP_VALUE;
  }
  public set TEMP_VALUE(value: any) {
    this._TEMP_VALUE = value;
  }

  private _COMPONENT_VALUE: any;
  /**
   * 组件值
   */
  public get COMPONENT_VALUE(): any {
    return this._COMPONENT_VALUE;
  }
  public set COMPONENT_VALUE(value: any) {
    this._COMPONENT_VALUE = value;
  }

  private _CACHE_VALUE: any;
  /**
   * 缓存值
   */
  public get CACHE_VALUE(): any {
    return this._CACHE_VALUE;
  }
  public set CACHE_VALUE(value: any) {
    this._CACHE_VALUE = value;
  }

  private _ROUTE_VALUE: any;
  /**
   * 路由值
   */
  public get ROUTE_VALUE(): any {
    return this._ROUTE_VALUE;
  }
  public set ROUTE_VALUE(value: any) {
    this._ROUTE_VALUE = value;
  }

  private _CASCADE_VALUE: any;
  /**
   * 级联值
   */
  public get CASCADE_VALUE(): any {
    return this._CASCADE_VALUE;
  }
  public set CASCADE_VALUE(value: any) {
    this._CASCADE_VALUE = value;
  }

  private _STATIC_COMPONENT_VALUE: any;
  /**
   * 静态组件值
   */
  public get STATIC_COMPONENT_VALUE(): any {
    return this._STATIC_COMPONENT_VALUE;
  }
  public set STATIC_COMPONENT_VALUE(value: any) {
    this._STATIC_COMPONENT_VALUE = value;
  }

  private _USER_VALUE: any;
  /**
   * 用户信息
   */
  public get USER_VALUE(): any {
    return this._USER_VALUE;
  }
  public set USER_VALUE(value: any) {
    this._USER_VALUE = value;
  }

  /**
   * 菜单信息
   */
  private _MENU_VALUE: any;
  public get MENU_VALUE(): any {
    return this._MENU_VALUE;
  }
  public set MENU_VALUE(value: any) {
    this._MENU_VALUE = value;
  }

  private _RETURN_VALUE: any;
  /**
   * 异步操作数据
   */
  public get RETURN_VALUE(): any {
    return this._RETURN_VALUE;
  }
  public set RETURN_VALUE(value: any) {
    this._RETURN_VALUE = value;
  }

  private _ADDED_ITEMS: any[];
  /**
   * 已添加的数据集合
   */
  public get ADDED_ITEMS(): any[] {
    return this._ADDED_ITEMS;
  }
  public set ADDED_ITEMS(value: any[]) {
    this._ADDED_ITEMS = value;
  }

  private _EDITED_ITEMS: any;
  /**
   * 已编辑的数据集合
   */
  public get EDITED_ITEMS(): any {
    return this._EDITED_ITEMS;
  }
  public set EDITED_ITEMS(value: any) {
    this._EDITED_ITEMS = value;
  }

  private _CHECKED_ITEMS_IDS: any;
  /**
   * 勾选数据的ID {ids:'di1,do2'}
   */
  public get CHECKED_ITEMS_IDS(): any {
    return this._CHECKED_ITEMS_IDS;
  }
  public set CHECKED_ITEMS_IDS(value: any) {
    this._CHECKED_ITEMS_IDS = value;
  }

  private _CHECKED_ITEMS: any[];
  public get CHECKED_ITEMS(): any[] {
    return this._CHECKED_ITEMS;
  }
  public set CHECKED_ITEMS(value: any[]) {
    this._CHECKED_ITEMS = value;
  }

  private _SELECTED_ITEM: any;
  /**
   * 选中记录的数据对象
   */
  public get SELECTED_ITEM(): any {
    return this._SELECTED_ITEM;
  }
  public set SELECTED_ITEM(value: any) {
    this._SELECTED_ITEM = value;
  }

  private _CURRENT_ITEM: any;
  /**
   * 当前操作的记录数据对象
   */
  public get CURRENT_ITEM(): any {
    return this._CURRENT_ITEM;
  }
  public set CURRENT_ITEM(value: any) {
    this._CURRENT_ITEM = value;
  }

  private _COMPONENT_VIEW_ID: string;
  public get COMPONENT_VIEW_ID(): string {
    return this._COMPONENT_VIEW_ID;
  }
  public set COMPONENT_VIEW_ID(value: string) {
    this._COMPONENT_VIEW_ID = value;
  }

  private _COMPONENT_METHODS: any;
  public get COMPONENT_METHODS(): any {
    return this._COMPONENT_METHODS;
  }
  public set COMPONENT_METHODS(value: any) {
    this._COMPONENT_METHODS = value;
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

  private _dataSourceCfg: {
    loadingOnInit?: boolean;
    loadingConfig?: any;
    loadingItemConfig?: any;
    expandConfig?: any;
    async?: boolean;
  };
  public get dataSourceCfg(): {
    loadingOnInit?: boolean;
    loadingConfig?: any;
    loadingItemConfig?: any;
    expandConfig?: any;
    async?: boolean;
  } {
    return this._dataSourceCfg;
  }
  public set dataSourceCfg(value: {
    loadingOnInit?: boolean;
    loadingConfig?: any;
    loadingItemConfig?: any;
    expandConfig?: any;
    async?: boolean;
  }) {
    this._dataSourceCfg = value;
  }

  public unsubscribeRelation() {
    if (this.subscription$) {
      this.subscription$.unsubscribe();
    }
    if (this.trigger_subscription$) {
      this.trigger_subscription$.unsubscribe();
    }
  }
  //#endregion

  //#region 数据源解析
  public setDataSourceCfg(config: any) {
    return {
      isloadingOnInit: config.sourceData.isloadingOnInit,
      loadingConfig: config.sourceData.loadingConfig,
      loadingItemConfig: config.sourceData.loadingItemConfig,
      expandConfig: config.sourceData.expandConfig,
      async: config.sourceData.async,
    };
  }
  //#endregion

  //#region 参数解析
  public buildParameters(paramsCfg: any, data?: any, isArray = false): any {
    let paramsResult: any | any[];
    if (!isArray && !data) {
      paramsResult = this._buildInnerParams(paramsCfg);
    } else if (!isArray && data) {
      paramsResult = this._buildInComingParams(paramsCfg, data);
    } else if (isArray && data && Array.isArray(data)) {
      paramsResult = this._buildArrayParams(paramsCfg, data);
    }
    return paramsResult;
  }

  private _buildInnerParams(paramsCfg) {
    return SmtParameterResolver.resolve({
      params: paramsCfg,
      tempValue: this.TEMP_VALUE,
      componentValue: this.COMPONENT_VALUE,
      initValue: this.INIT_VALUE,
      cacheValue: this.CACHE_VALUE,
      router: this.ROUTE_VALUE,
      addedItems: this.ADDED_ITEMS,
      editedItems: this.EDITED_ITEMS,
      returnValue: this.RETURN_VALUE,
      selectedItem: this.SELECTED_ITEM,
      checkedItemsIds: this.CHECKED_ITEMS_IDS,
      currentItem: this.CURRENT_ITEM,
      userValue: this.USER_VALUE,
      menuValue: this.componentService.cacheService.getNone('activeMenu') ? this.componentService.cacheService.getNone('activeMenu') : {},
    });
  }

  private _buildInComingParams(paramsCfg, data): any {
    let inputData = this._buildProcParams(data);
    return SmtParameterResolver.resolve({
      params: paramsCfg,
      tempValue: this.TEMP_VALUE,
      componentValue: this.COMPONENT_VALUE,
      dataItem: inputData ? inputData : data,
      initValue: this.INIT_VALUE,
      cacheValue: this.CACHE_VALUE,
      router: this.ROUTE_VALUE,
      addedItems: data,
      editedItems: data,
      //validation: data,
      returnValue: data,
      //checkedRow: this.ROWS_CHECKED,
      outputValue: data,
      selectedItem: this.SELECTED_ITEM,
      checkedItemsIds: this.CHECKED_ITEMS_IDS,
      currentItem: this.CURRENT_ITEM,
      userValue: this.USER_VALUE,
      menuValue: this.componentService.cacheService.getNone('activeMenu') ? this.componentService.cacheService.getNone('activeMenu') : {},
    });
  }

  private _buildArrayParams(paramsCfg, data): any[] {
    let returnData: any[] = [];
    data.map((d) => {
      const param = SmtParameterResolver.resolve({
        params: paramsCfg,
        tempValue: this.TEMP_VALUE,
        componentValue: d,
        dataItem: d,
        initValue: this.INIT_VALUE,
        cacheValue: this.CACHE_VALUE,
        router: this.ROUTE_VALUE,
        addedItems: d,
        editedItems: d,
        //validation: d,
        returnValue: d,
        //checkedRow: this.ROWS_CHECKED,
        outputValue: data,
        currentItem: this.CURRENT_ITEM,
        checkedItemsIds: this.CHECKED_ITEMS_IDS,
        userValue: this.USER_VALUE,
        menuValue: this.componentService.cacheService.getNone('activeMenu') ? this.componentService.cacheService.getNone('activeMenu') : {},
      });
      returnData.push(param);
    });
    return returnData;
  }

  private _buildProcParams(data: any) {
    let _returnData;
    if (data._procedure_resultset_1) {
      _returnData = { ...data._procedure_resultset_1[0], ...data };
    }
    return _returnData;
  }
  //#endregion

  //#region 异步请求
  public async executeHttp(ajaxConfig: any, data: any, option = '', isArray = false) {
    let _param_data = {};
    let _paramsResult: any;
    let _resultData: any;
    let _returnData: any;
    const _paramsList = [
      { name: 'headParams' },
      { name: 'pathParams' },
      { name: 'queryParams' },
      { name: 'bodyParams' },
      { name: 'params' },
    ];

    _paramsList.forEach((item: any) => {
      _param_data[item['name']] = ajaxConfig[item['name']] ? ajaxConfig[item['name']] : [];
    });

    _paramsResult = this.buildHttpParameters(_param_data, data, isArray, option);
    _resultData = await this.buildAjax(ajaxConfig, _paramsResult);

    if (ajaxConfig['enableResultData']) {
      _returnData = this.analysis_Data(_resultData, ajaxConfig.resultData);
    } else {
      _returnData = _resultData;
    }
    return _returnData;
  }

  public buildHttpParameters(paramsCfg, data?, isArray = false, options?) {
    let paramsResult: any = {};
    for (let p in paramsCfg) {
      let cfgItem = paramsCfg[p];
      if (p === 'queryParams' && options === 'paging') {
        paramsResult[p] = {
          ...this.buildParameters(cfgItem, data, isArray),
          ...this['_buildPaging'](),
          ...this['_buildSort'](),
          ...this['_buildFilter'](),
        };
      } else {
        if (cfgItem.length > 0) {
          paramsResult[p] = this.buildParameters(cfgItem, data, isArray);
        }
      }
    }
    return paramsResult;
  }

  public async buildAjax(ajaxConfig: any, paramsResult: any) {
    let ajaxType = ajaxConfig.ajaxType.toLowerCase();
    let url = ajaxConfig.url;
    for (let p in paramsResult['pathParams']) {
      url = url.replace(new RegExp(`\\${p}\\`, 'g'), paramsResult['pathParams'][p]);
    }

    let heads = new HttpHeaders(paramsResult['headParams']);
    let queryParam = paramsResult['queryParams'];
    let bodyParam = paramsResult['bodyParams'];
    if (ajaxType === 'post' || ajaxType === 'put') {
      return await this.componentService.apiService[ajaxType](url, bodyParam, queryParam, { headers: heads }).toPromise();
    } else if (ajaxType === 'get' || ajaxType === 'delete') {
      return await this.componentService.apiService[ajaxType](url, queryParam, { headers: heads }).toPromise();
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

  //#endregion

  //#region 弹出内容

  /**
   * 确认操作
   * @param cfg 确认框配置内容
   * @param callback 确认操作回调
   */
  public buildConfirm(cfg: any, callback: any): void {
    const confirmOptional = {
      nzTitle: cfg.title ? cfg.title : '',
      nzContent: cfg.content ? cfg.content : '',
      nzCancelText: cfg.cancelText ? cfg.cancelText : '取消',
      nzOkText: cfg.okText ? cfg.okText : '确认',
      nzOnOk: () => {
        if (callback) {
          callback();
        }
      },
    };
    this.componentService.modalService.confirm(confirmOptional);
  }

  public buildMessage(type: string, message: string): void {
    this.componentService.msgService.create(type, message);
  }

  //#endregion

  //#region 组件注入方法
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
  //#endregion

  // 表达式结果分析【true/false】
  // option是条件配置数组，data是当前操作数据项
  public analysisResult(option, data?) {
    // 数组 第一个 【and true  】【 or  false】  合并进去。
    // 返回 结果是否通过
    let Result = false;
    option.forEach((element, index) => {
      if (element['type'] === 'expression') {
        element['value'] = this.getExpressionResult(element['expression'], data);
      }
      if (element['type'] === 'brackets') {
        element['value'] = this.analysisResult(element['brackets'], data);
      }

      // 计算出当前条件最终值
      if (element['conditionType'] === 'and') {
        if (index === 0) {
          Result = true;
        }
        Result = Result && element['value'];
      }
      if (element['conditionType'] === 'or') {
        if (index === 0) {
          Result = false;
        }
        Result = Result || element['value'];
      }
    });
    return Result;
  }

  // 计算表达式
  computeExpression(expression) {
    let Expression;
    let result = false;
    switch (expression.comput) {
      case 'empty':
        break;
      case 'notempty':
        break;
      case 'null':
        break;
      case 'notnull':
        break;
      case 'true':
        result = this.expression_true(expression);
        break;
      case 'false':
        result = this.expression_false(expression);
        break;
      case 'regular':
        result = this.expression_regular(expression);
        break;
      case 'equal':
        result = this.expression_equal(expression);
        break;
      case 'notequal':
        break;
    }

    return result;
  }

  // 表达式取值
  getExpressionResult(expression, data?) {
    let back = {
      left: null,
      comput: null,
      righit: null,
    };
    if (expression) {
      if (expression['comput']) {
        back['comput'] = expression['comput'];
      }
      if (expression['leftExpression']) {
        back['left'] = this.getExpressionValue(expression['leftExpression'], data);
      }
      if (expression['righitExpression']) {
        back['righit'] = this.getExpressionValue(expression['righitExpression'], data);
      }
    } else {
    }

    return this.computeExpression(back);
  }

  getExpressionValue(option, data?) {
    let value = null;
    switch (option['type']) {
      case 'value':
        value = option['value'];
        break;
      case 'componentValue':
        value = this.COMPONENT_VALUE[option['valueName']];
        break;
      case 'tempValue':
        value = this.TEMP_VALUE[option['valueName']];
        break;
      case 'initValue':
        value = this.INIT_VALUE[option['valueName']];
        break;
      case 'dataItem':
        value = data[option['valueName']];
        break;

      // ......多种取值方式
      default:
        value = option['value'];
        break;
    }

    return value;
  }

  // 计算表达式
  expression_regular(option) {
    let regularflag = false;
    const reg1 = new RegExp(option.righit);
    regularflag = reg1.test(option.left);
    return regularflag;
  }
  expression_true(option) {
    let regularflag = false;
    regularflag = option.left === true ? true : false;
    return regularflag;
  }
  expression_false(option) {
    let regularflag = false;
    regularflag = option.left === false ? true : false;
    return regularflag;
  }
  expression_equal(option) {
    let regularflag = false;
    regularflag = option.left === option.righit ? true : false;
    return regularflag;
  }

  //#region 异常处理

  /**
   * 获取执行异常的返回结果
   * @returns
   */
  public getDefaultResult(): IExecuteResult {
    return {
      state: 1,
      error: {
        code: '',
        message: '',
        data: {},
        params: [],
      },
    };
  }

  /**
   * 获取执行异常的返回结果
   * @returns
   */
  public getCatchResult(): IExecuteResult {
    return {
      state: 0,
      error: {
        code: 'system.http.error',
        message: '系统异常。请联系管理员',
        data: {},
        params: [],
      },
    };
  }

  /**
   * 根据异步执行结果，返回方式执行的结果对象
   * @param response
   * @param hasData
   * @returns
   */
  public getExecuteResult(response: any, hasData: boolean): IExecuteResult {
    return {
      state: response.state,
      data: hasData ? response.data : {},
      validation: response.validation,
      error: response.error,
      exception: response.exception,
    };
  }
  //#endregion
}
