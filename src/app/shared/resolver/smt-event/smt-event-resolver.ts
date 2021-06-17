import { SmtMessageSenderEnterResolver } from "../smt-relation/smt-relation-resolver";

export interface SmtEventResolverModel {
    initValue: any,
    tempValue: any,
    item: any,
    cacheValue: any,
    componentEvent: any[] // 组件事件
}

export class SmtEventResolver {
    constructor(private _componentInstance: any) {
    }
    public resolve(model, pageCode) {
        const event: any[] = model.componentEvent;
        const initValue: any = model.initValue;
        const tempValue: any = model.tempValue;
        const item: any = model.item;
        const cacheValue: any = model.cacheValue;
        const param = {
            initValue: initValue,
            cacheValue: cacheValue,
            tempValue: tempValue,
            item: item,
            pageCode: pageCode
        }
        return { eventArray: event, param: param }
    }
}