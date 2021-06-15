import { from } from "rxjs";
import { map } from "rxjs/operators";
import { BsnCommandMessageModel } from "src/app/core/relations/bsn-relatives";
import { SmtParameterResolver } from "../smt-parameter/smt-parameter-resolver";
import { SmtProCondition } from "../smt-pro-condition/smt-pro-condition.resolver";

export interface SmtMessageSenderResolverModel {
    targetComponentId: string,
    targetComponentTitle: string,
    pageCode: string,
    commandType: string,
    commandTitle: string,
    params: any[],
    initValue: any,
    cacheValue: any,
    tempValue: any,
    item: any
}

export class SmtMessageSenderEnterResolver {
    constructor(private _componentInstance: any) {
    }
    public resolve(eventArray, param) {
        let source$: any;
        // for (let i = 0; i < eventArray.length; i++) {
        // const content = eventArray[i]['eventContent'];
        const sender_source$ = from(eventArray);
        const sender_subscribe$ = sender_source$.pipe(
            map((cfg) => {
                // 根据当前表格实例的类型,进行相应消息的注册
                // console.log('single sender cfg', cfg);
                // tslint:disable-next-line: no-use-before-declare
                new SmtMessageSenderResolver(this._componentInstance).resolve(cfg, param);
            }),
        );
        source$ = sender_subscribe$;
        return source$;
    }
    // }
}

export class SmtMessageSenderResolver {
    constructor(private _componentInstance: any) { }
    public resolve(contentArray, param) {
        // const commandObject = {
        //     targetComponentId: cfg['tagViewId'],
        //     targetComponentTitle: cfg['tagViewTitle'],
        //     pageCode: param.pageCode,
        //     commandType: cfg['commandType'],
        //     commandTitle: cfg['command'],
        //     params: cfg['parameters'],
        //     initValue: param.initValue,
        //     cacheValue: param.cacheValue,
        //     tempValue: param.tempValue,
        //     item: param.item
        // }
        contentArray['eventContent'].forEach(cfg => {
            if (cfg['preCondition'] && cfg['preCondition'].length > 0) {
                const beforeOperation = new SmtProCondition(cfg['preCondition'], param.initValue, param.cacheValue, param.tempValue, param.item)
                if (beforeOperation) {
                    // new SmtMessageSenderResolver(this._componentInstance, commandObject);
                    const paramsObj = {
                        params: cfg.parameters,
                        tempValue: param.tempValue,
                        componentValue: param.item,
                        initValue: param.tempValue,
                        cacheValue: param.cacheValue,
                        selectedItems: param.item,
                        currentItems: param.item,
                    }
                    const commandParams = SmtParameterResolver.resolve(paramsObj);
                    this._componentInstance.componentService.commonRelationSubject.next(
                        new BsnCommandMessageModel(
                            cfg['command'], // 命令发出组件的内容和下一步操作
                            cfg['tagPageId'],
                            cfg['tagViewId'],
                            commandParams,
                        )
                    );
                } else {
                    return
                }
            } else {
                // new SmtMessageSenderResolver(this._componentInstance, commandObject);
                const paramsObj = {
                    params: cfg.parameters,
                    tempValue: param.tempValue,
                    componentValue: param.item,
                    initValue: param.tempValue,
                    cacheValue: param.cacheValue,
                    selectedItems: param.item,
                    currentItems: param.item,
                }
                const commandParams = SmtParameterResolver.resolve(paramsObj);
                console.log('发送参数', commandParams, cfg['tagViewTitle'], cfg['tagPageId'], cfg['tagViewId']);
                this._componentInstance.componentService.commonRelationSubject.next(
                    new BsnCommandMessageModel(
                        cfg['command'], // 命令发出组件的内容和下一步操作
                        cfg['tagPageId'],
                        cfg['tagViewId'],
                        commandParams,
                    )
                );
            }
        });
    }
}

export class SmtMessageReceiverResolver {
    constructor(private _componentInstance: any) { }
    public resolve(customCommand) {
        customCommand.forEach(command => {
            if (command['commandContent'] && command['commandContent'].length > 0) {
                if (!this._componentInstance.subscription$) {
                    this._componentInstance.subscription$ = this._componentInstance.componentService.commonRelationSubject.subscribe((data) => {
                        command['commandContent'].map((cfg) => {
                            // 判断发送组件与接受组件是否一致
                            if (data.commandId === cfg[cfg['type']]['targetViewId']) {
                                // 判断发送触发器与接受触发起是否一致
                                // new TriggerResolver(
                                //     data,
                                //     this._componentInstance
                                // ).resolve();
                                this.exec(this._componentInstance, data, cfg);
                            }
                        });
                    });
                }
            }
        });
    }

    private exec(componentInstance, data, cfg) {
        componentInstance['execCommand'](data, cfg);
    }
}