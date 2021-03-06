import { CacheService } from '@delon/cache';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { Observable, from } from 'rxjs';
import { concatMap } from 'rxjs/operators';
import { API_SERVICE_METHOD } from 'src/app/core/relations/bsn-status';
import { ApiService } from 'src/app/core/services/api/api.service';
import { CommonUtils } from 'src/app/core/utils/common-utils';
import { InnerValue } from '../../components/cn-component.base';
import { ParameterResolver } from '../parameter/parameter.resolver';

export class BeforeOperationResolver implements InnerValue {
  tempValue: any;
  initValue: any;
  cacheValue: any;
  beforeOperationCfg: any;
  private _cacheService: CacheService;
  constructor(
    private _config: any,
    private _initValue: any,
    private _cacheValue: any,
    private _tempValue: any,
    private _apiService?: ApiService,
    private _modal?: NzModalService,
    private _message?: NzMessageService,
  ) {
    this.tempValue = _tempValue;
    this.initValue = _initValue;
    this.cacheValue = _cacheValue;
    this.beforeOperationCfg = _config;
    this.resolverBeforeOperation();
  }
  private _beforeOperationMap: Map<string, any>;
  public get beforeOperationMap() {
    return this._beforeOperationMap;
  }
  public set beforeOperationMap(value) {
    this._beforeOperationMap = value;
  }
  private _operationItemData;
  public get operationItemData() {
    return this._operationItemData;
  }
  public set operationItemData(value) {
    this._operationItemData = value;
  }

  private _operationItemsData;
  public get operationItemsData() {
    return this._operationItemsData;
  }
  public set operationItemsData(value) {
    this._operationItemsData = value;
  }

  private buildParameter(paramsCfg, value) {
    const params = ParameterResolver.resolve({
      params: paramsCfg,
      item: value,
      componentValue: value,
      tempValue: this.tempValue,
      initValue: this.initValue,
      cacheValue: this.cacheValue,
      userValue: this._cacheService.getNone('userInfo') ? this._cacheService.getNone('userInfo') : {},
    });
    return params;
  }

  public buildUrl(urlConfig) {
    let url;
    if (CommonUtils.isString(urlConfig)) {
      url = urlConfig;
    } else {
      const pc = ParameterResolver.resolve({
        params: urlConfig.params,
        tempValue: this.tempValue,
        initValue: this.initValue,
        cacheValue: this.cacheValue,
        userValue: this._cacheService.getNone('userInfo') ? this._cacheService.getNone('userInfo') : {},
      });
      url = `${urlConfig.url.parent}/${pc}/${urlConfig.url.child}`;
    }
    return url;
  }

  /**
   * 1????????????????????????????????????observe??????
   * 2?????????observe???????????????????????????,??????every??????????????????
   * 3?????????observe?????????
   */

  public buildStatusObservableByStatusCfg(option): Observable<any> {
    let status_subscribe$: Observable<any>;
    if (this.beforeOperationMap.has(option.name)) {
      const op_status = this.beforeOperationMap.get(option.name);
      const status_source$ = from(op_status);
      status_subscribe$ = status_source$.pipe(concatMap((val) => this.buildConditionsObservableByConditionCfg(val)));
    }
    return status_subscribe$;
  }

  private buildConditionsObservableByConditionCfg(conditionsCfg) {
    const conditions_source$ = from(conditionsCfg.conditions);
    const conditions_subscribe$ = conditions_source$.pipe(
      concatMap((val) => {
        // ?????????????????????????????????
        return this.buildOperation(val);
      }),
    );
    const that = this;
    conditions_subscribe$.subscribe((val) => {
      if (val === true) {
        that.beforeOperationMessage(conditionsCfg.action, val);
        // tslint:disable-next-line: no-string-literal
      }
    });
    return conditions_subscribe$;
  }

  private async buildOperation(items) {
    const operationResult = [];
    for (const item of items) {
      switch (item.checkType) {
        case 'value':
          const valueResult = await this.asyncMatchValueCondition(item);
          operationResult.push(valueResult);
          break;
        case 'regexp':
          const regexpResult = await this.asyncMatchRegexpCondition(item);
          operationResult.push(regexpResult);
          break;
        case 'tempValue':
          const tempValueResult = await this.asnycMatchTempValueCondition(item);
          operationResult.push(tempValueResult);
          break;
        case 'initValue':
          const initValueResult = await this.asyncMatchInitValueCondition(item);
          operationResult.push(initValueResult);
          break;
        case 'cacheValue':
          const cacheValueResult = await this.asyncMatchCacheValueCondition(item);
          operationResult.push(cacheValueResult);
          break;
        case 'innerValue':
          const innerResult = await this.asyncInnerValueCondition(item);
          operationResult.push(innerResult);
          break;
        case 'executeAjax':
          // ????????????????????????
          const executeAjaxValue = await this.executeAjaxCondition(item);
          operationResult.push(executeAjaxValue);
          break;
        case 'ajaxValue':
          // ????????????????????????
          const ajaxValue = await this.matchAjaxValueCondition(item);
          operationResult.push(ajaxValue);
          break;
      }
    }

    return operationResult.every((r) => r === true);
  }

  private async asyncMatchValueCondition(item) {
    let result = false;
    if (this.operationItemData) {
      if (this.operationItemData.hasOwnProperty(item.name)) {
        result = (await this.operationItemData[item.name]) === item.value;
      } else {
        result = await false;
      }
    }
    return result;
  }

  private async asyncInnerValueCondition(item) {
    let result = false;
    let tmpValue;
    let cchValue;
    let iniValue;
    if (item.tempValue) {
      tmpValue = this.tempValue[item.tempValue];
    }
    if (item.cacheValue) {
      cchValue = this.cacheValue[item.cacheValue];
    }
    if (item.initValue) {
      iniValue = this.initValue[item.initValue];
    }

    if (tmpValue && cchValue) {
      result = tmpValue !== cchValue;
    } else if (tmpValue && iniValue) {
      result = tmpValue !== iniValue;
    } else if (cchValue && iniValue) {
      result = cchValue !== iniValue;
    }

    return result;
  }

  /**
   * ????????????????????????
   * @param dataItem ???????????????
   * @param statusItem ??????????????????
   */
  private async asyncMatchRegexpCondition(statusItem) {
    let result = false;
    if (this.operationItemData) {
      const reg = new RegExp(statusItem.value ? statusItem.value : '');
      result = reg.test(this.operationItemData[statusItem.name]);
    }
    return result;
  }

  private async asnycMatchTempValueCondition(statusItem) {
    // ?????????????????????????????????????????????????????????
    let result = false;
    if (statusItem.name) {
      result = this.operationItemData[statusItem.name] !== this.tempValue[statusItem.valueName];
    } else {
      const reg = new RegExp(statusItem.value);
      result = reg.test(this.tempValue[statusItem.valueName]);
      //   if (this.tempValue[statusItem['valueName']] === statusItem['value']) {
      //     result = true;
      //   }
    }
    return result;
  }

  private async asyncMatchInitValueCondition(statusItem) {
    let result = false;
    if (statusItem.name) {
      result = this.operationItemData[statusItem.name] !== this.initValue[statusItem.valueName];
    } else {
      const reg = new RegExp(statusItem.value);
      result = reg.test(this.initValue[statusItem.valueName]);
    }
    return result;
  }

  private async asyncMatchCacheValueCondition(statusItem) {
    let result = false;
    if (statusItem.name) {
      result = this.operationItemData[statusItem.name] !== this.cacheValue[statusItem.valueName];
    } else {
      const reg = new RegExp(statusItem.value);
      result = reg.test(this.cacheValue[statusItem.valueName]);
    }
    return result;
  }

  /**
   * (?????????)
   * ?????????????????????????????????????????????????????????????????????,????????????????????????
   * ???????????????????????????????????????????????????????????????,???????????????????????????????????????????????????
   * @param statusItem
   */
  private async matchAjaxValueCondition(statusItem) {
    let result = false;
    const url = this.buildUrl(statusItem.ajaxConfig.url);
    const params = this.buildParameter(statusItem.ajaxConfig.params, this.operationItemData);
    const response = await this._apiService[statusItem.ajaxConfig.ajaxType](url, params).toPromise();
    if (response.success) {
      if (statusItem.name) {
        if (Array.isArray(response.data)) {
          result = response.data.every((s) => this.operationItemData[statusItem.name] === s[statusItem.valueName]);
        } else {
          result = this.operationItemData[statusItem.name] === response.data[statusItem.valueName];
        }
      } else {
        const reg = new RegExp(statusItem.value);
        if (Array.isArray(response.data)) {
          result = response.data.every((s) => reg.test(s[statusItem.name]));
        } else {
          result = reg.test(response.data[statusItem.valueName]);
        }
      }
    }
    return result;
  }

  /**
   * (?????????)
   * ????????????????????????API,?????????API???????????????,????????????????????????
   * @returns boolean
   */
  private async executeAjaxCondition(statusItem) {
    const url = this.buildUrl(statusItem.ajaxConfig.url);
    const params = this.buildParameter(statusItem.ajaxConfig.params, this.operationItemData);
    // ?????????????????????????????????????????????
    // ??????????????????API???????????????????????????,?????????????????????
    const result = await this._apiService[API_SERVICE_METHOD[statusItem.ajaxConfig.ajaxType]](url, params).toPromise();
    return result.success;
  }

  private innerValueCondition(statusItem) {
    // ?????????????????????????????????????????????????????????
    let result = false;
    let tmpValue;
    let cchValue;
    let iniValue;
    if (statusItem.tempValue) {
      tmpValue = this.tempValue[statusItem.tempValue];
    }
    if (statusItem.cacheValue) {
      cchValue = this.cacheValue[statusItem.cacheValue];
    }
    if (statusItem.initValue) {
      iniValue = this.initValue[statusItem.initValue];
    }

    if (tmpValue && cchValue) {
      result = tmpValue !== cchValue;
    } else if (tmpValue && iniValue) {
      result = tmpValue !== iniValue;
    } else if (cchValue && iniValue) {
      result = cchValue !== iniValue;
    } else if (iniValue && tmpValue) {
      result = iniValue !== tmpValue;
    }

    return result;
  }

  /**
   * ??????????????????????????????
   * @param conditions
   */
  private async handleCheckedRowsOperationConditions(conditions) {
    const orResult = [];
    conditions.forEach(async (elements) => {
      // ??????????????????????????????
      const andResults = [];
      elements.forEach(async (item) => {
        // ????????????????????????
        switch (item.checkType) {
          case 'value':
            const checkedValueResult = await this.matchCheckedValueCondition(item);
            andResults.push(checkedValueResult);
            break;
          case 'regexp':
            const matchCheckedRegexpResult = await this.matchCheckedRegexpCondition(item);
            andResults.push(matchCheckedRegexpResult);
            break;
          case 'tempValue':
            const matchCheckedTempValueResult = await this.matchCheckedTempValueCondition(item);
            andResults.push(matchCheckedTempValueResult);
            break;
          case 'initValue':
            const matchCheckedInitValueResult = await this.matchCheckedInitValueCondition(item);
            andResults.push(matchCheckedInitValueResult);
            break;
          case 'cacheValue':
            const matchCheckedCacheValueResult = await this.matchCheckedCacheValueCondition(item);
            andResults.push(matchCheckedCacheValueResult);
            break;
          case 'innerValue':
            const innerValueResult = await this.innerValueCondition(item);
            andResults.push(innerValueResult);
            break;
        }
      });
      // ??????????????????????????????
      const and = await andResults.every((s) => s === true);
      orResult.push(and);
    });
    return orResult.some((s) => s === true);
  }

  /**
   * ???????????????????????????
   * @param statusItem
   */
  private async matchCheckedCacheValueCondition(statusItem) {
    let result = false;
    if (this.operationItemsData) {
      if (statusItem.name) {
        result = await this.operationItemsData.some((row) => row[statusItem.name] !== this.cacheValue[statusItem.valueName]);
      } else {
        const reg = new RegExp(statusItem.value);
        result = await reg.test(this.cacheValue[statusItem.valueName]);
      }
    }
    return result;
  }

  /**
   * ???????????????????????????
   * @param statusItem
   */
  private async matchCheckedTempValueCondition(statusItem) {
    let result = false;
    if (this.operationItemsData) {
      if (statusItem.name) {
        result = await this.operationItemsData.some((row) => row[statusItem.name] !== this.tempValue[statusItem.valueName]);
      } else {
        const reg = new RegExp(statusItem.value);
        result = await reg.test(this.tempValue[statusItem.valueName]);
      }
    }
    return result;
  }

  /**
   * ???????????????????????????
   * @param statusItem
   */
  private async matchCheckedInitValueCondition(statusItem) {
    let result = false;
    if (this.operationItemsData) {
      if (statusItem.name) {
        result = await this.operationItemsData.some((row) => row[statusItem.name] !== this.initValue[statusItem.valueName]);
      } else {
        const reg = new RegExp(statusItem.value);
        result = await reg.test(this.initValue[statusItem.valueName]);
      }
    }
    return result;
  }

  /**
   * ????????????????????????
   * @param checkedRows
   * @param statusItem
   */
  private async matchCheckedValueCondition(statusItem) {
    let result = false;
    if (this.operationItemsData.length > 0) {
      result = await this.operationItemsData.some((row) => row[statusItem.name] === statusItem.value);
    }
    return result;
  }

  /**
   * ??????????????????????????????
   * @param checkedRows
   * @param statusItem
   */
  private async matchCheckedRegexpCondition(statusItem) {
    let result = false;
    if (this.operationItemsData.length > 0) {
      const reg = new RegExp(statusItem.value ? statusItem.value : '');
      const txt = await reg.test(this.operationItemsData[0][statusItem.name]);
      result = await this.operationItemsData.some((row) => reg.test(row[statusItem.name]));
    }
    return result;
  }

  /**
   * ??????????????????
   * @param actionResult
   * @param action
   */
  private handleOperationAction(actionResult, action) {
    let result = true;
    if (action) {
      switch (action.execute) {
        case 'prevent':
          if (actionResult) {
            this.beforeOperationMessage(action, result);
          } else {
            result = false;
          }
          break;
        case 'continue':
          if (actionResult) {
            result = false;
          } else {
            this.beforeOperationMessage(action, result);
            // result = true;
          }
          break;
      }
    }

    return result;
  }

  /**
   * ??????????????????
   * @param action
   */
  private beforeOperationMessage(action, result) {
    if (action.type === 'confirm') {
      this._modal.confirm({
        nzTitle: action.title,
        nzContent: action.message,
        nzOnOk: () => {
          result = false;
          // ??????????????????
        },
        nzOnCancel() {
          result = true;
        },
      });
    } else {
      this._message[action.type](action.message);
      result = action.execute === 'prevent' ? true : false;
    }
  }

  /**
   * ??????????????????????????????
   */
  private resolverBeforeOperation() {
    this._beforeOperationMap = new Map();
    if (this.beforeOperationCfg && Array.isArray(this.beforeOperationCfg) && this.beforeOperationCfg.length > 0) {
      this.beforeOperationCfg.forEach((element) => {
        this._beforeOperationMap.set(element.name, element.status);
      });
    }
  }
}
