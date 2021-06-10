import { NzModalService } from "ng-zorro-antd/modal";
import { SmtParameterResolver } from "../smt-parameter/smt-parameter-resolver";
import { SmtProCondition } from "../smt-pro-condition/smt-pro-condition.resolver";
import { SmtMessageSenderResolver } from "../smt-relation/smt-relation-resolver";

export interface SmtCommandResolverModel {
    params: any[],
    initValue: any,
    cacheValue: any,
    tempValue: any,
    item: any,
    pageCode: string
}

export class SmtCommandResolver {
    model: any;
    constructor(private _componentInstance, model: SmtCommandResolverModel, data: any, private _modal?: NzModalService,) {
        this.model = model;
    }
    private resolver(commandArray, model, data) {
        for (let i = 0; i < commandArray.length; i++) {
            if (commandArray[i]['preCondition'].length > 0) {
                const beforeOperation = new SmtProCondition(commandArray[i]['preCondition'], model.initValue, model.cacheValue, model.tempValue, model.item)
                if (beforeOperation) {
                    const paramObj: any = this.declareParams(commandArray[i]['declareParameters']);
                    this.savePrams(commandArray[i]['declareParameters'], data);
                    this.commandOperate(commandArray[i]['commandContent'], model);
                } else {
                    return;
                }
            }
        }
    }

    private declareParams(params) {
        const param = {};
        params.forEach(p => {
            param[p['name']] = p['dataType'];
        });
        return param;
    }

    private savePrams(params, data) {
        params.forEach(p => {
            if (p['valueTo']) {
                switch (p.valueTo) {
                    case 'tempValue':
                        this._componentInstance.tempValue[p.name] = data[p.name];
                        break;
                    case 'initValue':
                        this._componentInstance.initValue[p.name] = data[p.name];
                        break;
                    case 'staticComponentValue':
                        this._componentInstance.staticComponentValue[p.name] = data[p.name];
                        break;
                }
            }
        });
    }

    private commandOperate(command, model) {
        for (let i = 0; i < command.length; i++) {
            if (command[i]['type'] === 'commandConfig') {
                let sendResult = true;
                // 解析命令，发送命令方法
                const commandArray = command[i]['commandConfig'];
                commandArray.forEach(command, sendResult => {
                    const commandObject = {
                        targetComponentId: command['tagViewId'],
                        targetComponentTitle: command['tagViewTitle'],
                        pageCode: model.pageCode,
                        commandType: command['commandType'],
                        commandTitle: command['command'],
                        params: command['parameters'],
                        initValue: model.initValue,
                        cacheValue: model.cacheValue,
                        tempValue: model.tempValue,
                        item: model.item
                    }
                    sendResult = sendResult && new SmtMessageSenderResolver(this._componentInstance, commandObject);
                });
                if (sendResult) {
                    const nextOperate = this.resultResolver(command['reasult']);
                    if (nextOperate === 'next') { }
                    else if (nextOperate === 'prevent') {
                        return;
                    } else if (nextOperate === 'pass') {
                        break;
                    }
                }
            } else if (command[i]['type'] === 'ajaxConfig') {
                this._componentInstance['executeHttp'](command[i]['ajaxConfig']);

            }
        }
    }

    private resultResolver(resultArray) {
        let nextOperate: any;
        let returnValue: any;
        resultArray.forEach(result => {
            switch (result['type']) {
                case 'message':
                    nextOperate = this.showMessage(result['message'], returnValue);
                    break;
                case 'confirm':
                    nextOperate = this.showConfirm(result['confirm'], returnValue);
                    break;
                case 'execution':
                    nextOperate = this.showExecution(result['execution'], returnValue);
                    break;
            }
        });
        return nextOperate;
    }

    // 根据前置条件展示提示框
    showMessage(cfg, returnValue) {
        this._modal[cfg['type']]({
            nzTitle: cfg['messageInfo']['title'] ? cfg['messageInfo']['title'] : '提示',
            nzContent: this.createContent(cfg['messageInfo'])
        })
        returnValue = this.nextOperate(cfg['messageInfo']['point']);
        return returnValue;
    }

    showConfirm(cfg, returnValue) {
        this._modal[cfg['type']]({
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
        const params = this.buildParameter(cfg['parameters'], this.model);
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

    private buildParameter(paramsCfg, model?) {
        const params = SmtParameterResolver.resolve({
            params: paramsCfg,
            tempValue: model.tempValue,
            initValue: model.initValue,
            currentItems: model.item,
            selectedItems: model.item
        });
        return params;
    }


}