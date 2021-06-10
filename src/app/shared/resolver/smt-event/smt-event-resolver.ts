import { SmtProCondition } from "../smt-pro-condition/smt-pro-condition.resolver";
import { SmtMessageSenderResolver } from "../smt-relation/smt-relation-resolver";

export interface SmtEventResolverModel {
    eventType: string, // 传入的事件类型标识
    componentId: string, // 触发事件的组件Id
    initValue: any,
    tempValue: any,
    item: any,
    cacheValue: any,
    componentEvent: any[] // 组件事件
}

export class SmtEventResolver {
    constructor(private _componentInstance: any, model: SmtEventResolverModel, pageCode: string) {
        this.resolve(model, pageCode);
    }
    public resolve(model, pageCode) {
        const event: any[] = model.componentEvent;
        const type: string = model.eventType;
        const componentId: string = model.componentId;
        const initValue: any = model.initValue;
        const tempValue: any = model.tempValue;
        const item: any = model.item;
        const cacheValue: any = model.cacheValue;
        for (let i = 0; i < event.length; i++) {
            if (event[i]['eventName'] === type) {
                for (let j = 0; j < event[i]['eventContent'].length; j++) {
                    if (event[i]['eventContent']['tagViewId'] === componentId) {
                        const content = event[i]['eventContent'];
                        if (content['preCondition'] && content['preCondition'].length > 0) {
                            const beforeOperation = new SmtProCondition(content['preCondition'], initValue, cacheValue, tempValue, item)
                            if (beforeOperation) {
                                // 解析命令，发送命令方法
                                const commandObject = {
                                    targetComponentId: content['tagViewId'],
                                    targetComponentTitle: content['tagViewTitle'],
                                    pageCode: pageCode,
                                    commandType: content['commandType'],
                                    commandTitle: content['command'],
                                    params: content['parameters'],
                                    initValue: initValue,
                                    cacheValue: cacheValue,
                                    tempValue: tempValue,
                                    item: item
                                }
                                new SmtMessageSenderResolver(this._componentInstance, commandObject);
                            } else {
                                return
                            }
                        }
                    }
                }
            }
        }
    }
}