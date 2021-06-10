import { BsnCommandMessageModel } from "src/app/core/relations/bsn-relatives";
import { SmtParameterResolver } from "../smt-parameter/smt-parameter-resolver";

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

export class SmtMessageSenderResolver {
    constructor(private _componentInstance: any, model: SmtMessageSenderResolverModel) {
        this.resolve(model);
    }
    public resolve(model) {
        const paramsObj = {
            params: model.params,
            tempValue: model.tempValue,
            componentValue: model.item,
            initValue: model.tempValue,
            cacheValue: model.cacheValue,
            selectedItems: model.item,
            currentItems: model.item,
        }
        const commandParams = SmtParameterResolver.resolve(paramsObj);
        this._componentInstance.componentService.commonRelationSubject.next(
            new BsnCommandMessageModel(
                model.commandTitle, // 命令发出组件的内容和下一步操作
                model.pageCode,
                model.targetComponentId,
                commandParams,
            )
        );
        return true;
    }
}

// export class SmtMessageReceiverResolver {
//     constructor(private _componentInstance: any) { }
//     public resolve(commandContent) {
//         this._componentInstance.componentService.commonRelationSubject.subscribe((data) => {
//             commandContent.map((cfg) => {
//                 cfg.map((item) => {
//                     // 判断发送组件与接受组件是否一致
//                     if (data.viewId === item.targetViewId) {
//                         // 判断发送触发器与接受触发起是否一致
//                         // new TriggerResolver(
//                         //     data,
//                         //     this._componentInstance
//                         // ).resolve();
//                         this.chooseMethod(data, item);
//                     }
//                 })
//             });
//         }
//     }
// }