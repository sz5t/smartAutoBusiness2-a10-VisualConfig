import { HttpHeaders } from '@angular/common/http';
import { environment } from '@env/environment';
import { ComponentServiceProvider } from 'src/app/core/services/components/component.service';
import { SmtParameterResolver } from '../resolver/smt-parameter/smt-parameter-resolver';

/**
 * 1、参数解析
 * 2、异步请求
 * 3、弹出窗体
 * 4、弹出消息
 * 5、弹出页面
 */
export class SmtComponentBase {
  constructor(public componentService: ComponentServiceProvider) {}
  //#region 组件公共属性定义

  private _initValue: any;
  /**
   * 初始化值变量
   */
  public get initValue(): any {
    return this._initValue ? this._initValue : {};
  }
  public set initValue(value: any) {
    this._initValue = value;
  }
  private _tempValue: any;
  /**
   * 组件内部临时变量
   */
  public get tempValue(): any {
    return this._tempValue ? this._tempValue : {};
  }
  public set tempValue(value: any) {
    this._tempValue = value;
  }

  /**
   * 缓存值
   */
  private _cacheValue: any;
  public get cacheValue(): any {
    return this._cacheValue ? this._cacheValue : {};
  }
  public set cacheValue(value: any) {
    this._cacheValue = value;
  }

  private _routerValue: any;
  /**
   * 路由值
   */
  public get routerValue(): any {
    return this._routerValue ? this._routerValue : {};
  }
  public set routerValue(value: any) {
    this._routerValue = value;
  }

  private _cascadeValue: any;
  /**
   * 级联值
   */
  public get cascadeValue(): any {
    return this._cascadeValue ? this._cascadeValue : {};
  }
  public set cascadeValue(value: any) {
    this._cascadeValue = value;
  }

  private _staticComponentValue: any;
  /**
   * 静态组件值
   */
  public get staticComponentValue(): any {
    return this._staticComponentValue ? this._staticComponentValue : {};
  }
  public set staticComponentValue(value: any) {
    this._staticComponentValue = value;
  }

  private _userValue: any;
  /**
   * 用户信息
   */
  public get userValue(): any {
    return this._userValue ? this._userValue : {};
  }
  public set userValue(value: any) {
    this._userValue = value;
  }

  /**
   * 菜单信息
   */
  private _menuValue: any;
  public get menuValue(): any {
    return this._menuValue ? this._menuValue : {};
  }
  public set menuValue(value: any) {
    this._menuValue = value;
  }

  //#endregion

  //#region 参数解析
  public buildParameters(paramsCfg: any, data?: any, isArray = false): any {
    let paramsResult: any | any[];

    return paramsResult;
  }

  private _buildInnerParams(paramsCfg) {
    // return SmtParameterResolver.resolve({
    //     params: paramsCfg,
    //     tempValue: this.tempValue,
    //     componentValue: this.COMPONENT_VALUE,
    //     item: this.ROW_SELECTED,
    //     initValue: this.initValue,
    //     cacheValue: this.cacheValue,
    //     router: this.routerValue,
    //     addedRows: this.ROWS_ADDED,
    //     editedRows: this.ROWS_EDITED,
    //     checkedRow: this.ROWS_CHECKED,
    //     outputValue: data,
    //     returnValue: data,
    //     selectedRow: this.ROW_SELECTED,
    //     currentRow: this.ROW_CURRENT,
    //     userValue: this.userValue,
    //     menuValue: this.componentService.cacheService.getNone('activeMenu') ? this.componentService.cacheService.getNone('activeMenu') : {},
    //   });
  }

  private _buildInComingParams(paramsCfg, data) {}

  private _buildArrayParams() {}

  private _buildProcParams() {}
  //#endregion

  //#region 异步请求
  public async executeHttp(ajaxConfig: any, data: any, option = '') {
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

    _paramsResult = this.buildHttpParameters(_param_data, data, false, option);
    _resultData = await this.buildAjax(ajaxConfig, _paramsResult);

    if (ajaxConfig['enableResultData']) {
      _returnData = this.analysis_Data(_resultData, ajaxConfig.resultData);
    } else {
      _returnData = _resultData;
    }
    return _returnData;
  }

  public buildHttpParameters(paramsCfg, data?, isArray = false, paramsMethod?, options?) {
    let paramsResult: any = {};
    for (let p in paramsCfg) {
      let cfgItem = paramsCfg[p];
      if (p === 'queryParams' && options === 'paging') {
        paramsResult[p] = {
          ...this[paramsMethod](cfgItem, data, isArray),
          ...this['_buildPaging'](),
          ...this['_buildSort'](),
          ...this['_buildFilter'](),
        };
      } else {
        paramsResult[p] = this[paramsMethod](cfgItem, data, isArray);
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
}
