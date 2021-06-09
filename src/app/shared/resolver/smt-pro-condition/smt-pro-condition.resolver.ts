import { Input } from "@angular/core";
import { CacheService } from "@delon/cache";
import { NzMessageService } from "ng-zorro-antd/message";
import { NzModalService } from "ng-zorro-antd/modal";
import { ApiService } from "src/app/core/services/api/api.service";
import { SmtParameterResolver } from "../smt-parameter/smt-parameter-resolver";

export class SmtProCondition {
  tempValue: any;
  initValue: any;
  cacheValue: any;
  beforeOperationCfg: any;
  resultMap: any = {
    pass: true,
    prevent: false
  }
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

  private resolverBeforeOperation() {
    const result = this.resolverBeforeOperationInfo();
    return result;
  }

  private resolverBeforeOperationInfo() {
    let result = false;
    for (let i = 0; i < this.beforeOperationCfg.length; i++) {
      const result = this.analysisResult(this.beforeOperationCfg[i]['condition']);
      const nextOperate = this.responseOperate(result, this.beforeOperationCfg[i]['reasult']);
      if (nextOperate === 'next') { }
      else if (nextOperate === 'prevent') {
        return;
      } else if (nextOperate === 'pass') {
        break;
      }
    }

    result = true

    return result;
  }

  private buildParameter(paramsCfg, value?) {
    const params = SmtParameterResolver.resolve({
      params: paramsCfg,
      tempValue: this.tempValue,
      initValue: this.initValue,
      currentItems: value,
      selectedItems: value
    });
    return params;
  }

  private analysisResult(cfg) {
    // 数组 第一个 【and true  】【 or  false】  合并进去。

    // 返回 结果是否通过

    let Result = false;
    cfg.forEach((element, index) => {

      if (element['type'] === 'expression') {
        element['value'] = this.getExpressionResult(element['expression']);
      }
      if (element['type'] === 'brackets') {
        element['value'] = this.analysisResult(element['brackets']);
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

  private responseOperate(conditionResult, operation) {
    let nextOperate: any;
    operation.forEach(e => {
      if (this.resultMap(e['info']) === conditionResult) {
        switch (e['type']) {
          case 'message':
            this.showMessage(e['message']);
            break;
          case 'confirm':
            this.showConfirm(e['confirm']);
            break;
          case 'execution':
            // this.showExecution();
            break;
        }
      }
    });
    return nextOperate;
  }

  getExpressionResult(expression) {
    let back = {
      left: null,
      comput: null,
      righit: null
    }
    if (expression) {

      if (expression['comput']) {
        back['comput'] = expression['comput'];
      }
      if (expression['leftExpression']) {
        back['left'] = this.buildParameter(expression['leftExpression']);
      }
      if (expression['righitExpression']) {
        back['righit'] = this.buildParameter(expression['righitExpression']);
      }

    } else {

    }

    return this.computeExpression(back);

  }


  // 计算表达式
  Expression_regular(option) {

    let regularflag = false;
    const reg1 = new RegExp(option.righit);
    regularflag = reg1.test(option.left);
    return regularflag;
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
        break;
      case 'false':
        break;
      case 'regular':
        result = this.Expression_regular(expression);
        break;
      case 'equal':
        break;
      case 'notequal':
        break;


    }

    return result;


  }

  // 根据前置条件展示提示框
  showMessage(cfg) {
    this._modal[cfg['type']]({
      nzTitle: cfg['messageInfo']['title'] ? cfg['messageInfo']['title'] : '提示',
      nzContent: this.createContent(cfg['messageInfo'])
    })
  }

  showConfirm(cfg) {
    this._modal[cfg['type']]({
      nzTitle: cfg['contentInfo']['title'] ? cfg['contentInfo']['title'] : '提示',
      nzContent: this.createContent(cfg['contentInfo']),
      nzOkText: cfg['okInfo']['title'],
      nzCancelText: cfg['cancelInfo']['title'],
      nzOnOk: () => console.log('OK'),
      nzOnCancel: () => console.log('Cancel')
    })
  }

  createContent(cfg) {
    let content = cfg['content'];
    const params = this.buildParameter(cfg['parameters']);
    const array = cfg['content'].match(/{(\S*)}/)
    for (let i = 1; i < array.length; i++) {
      const tempName = array[i];
      const repalceString = "{" + tempName + "}"
      content = content.replace(repalceString, params[tempName]);
    }
    return content;
  }
}