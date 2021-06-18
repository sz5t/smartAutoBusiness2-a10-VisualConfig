import { SmtParameterResolver } from "../smt-parameter/smt-parameter-resolver";

export class SmtPreCondition {
  resultMap: any = {
    pass: true,
    prevent: false
  }
  constructor(
    private _componentInstance: any
  ) {
  }

  public resolverBeforeOperationInfo(config, modal) {
    let result = false;
    for (let i = 0; i < config.length; i++) {
      const result = this.analysisResult(config[i]['condition']);
      const nextOperate = this.responseOperate(result, config[i]['reasult'], modal);
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

  private buildParameter(paramsCfg) {
    const params = SmtParameterResolver.resolve({
      params: paramsCfg,
      tempValue: this._componentInstance.TEMP_VALUE,
      initValue: this._componentInstance.INIT_VALUE,
      currentItem: this._componentInstance.CURRENT_ITEM,
      selectedItem: this._componentInstance.SELECTED_ITEM
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

  private responseOperate(conditionResult, operation, modal) {
    let nextOperate: any;
    let returnValue: any;
    operation.forEach(e => {
      if (this.resultMap(e['info']) === conditionResult) {
        switch (e['type']) {
          case 'message':
            nextOperate = this.showMessage(e['message'], returnValue, modal);
            break;
          case 'confirm':
            nextOperate = this.showConfirm(e['confirm'], returnValue, modal);
            break;
          case 'execution':
            nextOperate = this.showExecution(e['execution'], returnValue);
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
  showMessage(cfg, returnValue, modal) {
    modal[cfg['type']]({
      nzTitle: cfg['messageInfo']['title'] ? cfg['messageInfo']['title'] : '提示',
      nzContent: this.createContent(cfg['messageInfo'])
    })
    returnValue = this.nextOperate(cfg['messageInfo']['point']);
    return returnValue;
  }

  showConfirm(cfg, returnValue, modal) {
    modal[cfg['type']]({
      nzTitle: cfg['contentInfo']['title'] ? cfg['contentInfo']['title'] : '提示',
      nzContent: this.createContent(cfg['contentInfo']),
      nzOkText: cfg['okInfo']['title'],
      nzCancelText: cfg['cancelInfo']['title'],
      nzOnOk: () => {
        returnValue = this.nextOperate(cfg['okInfo']['point']);
      },
      nzOnCancel: () => {
        returnValue = this.nextOperate(cfg['cancelInfo']['point']);
      }
    })
    return returnValue;
  }

  showExecution(cfg, returnValue) {
    returnValue = this.nextOperate(cfg['point']);
    return returnValue;
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

  nextOperate(type) {
    return type;
  }
}