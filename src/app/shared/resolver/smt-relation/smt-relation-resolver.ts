import { BsnCommandMessageModel } from "src/app/core/relations/bsn-relatives";

export class SmtMessageSenderResolver {
    constructor(private _componentInstance: any) { }
    public resolve(cfg) {
        // const commandParams = this._componentInstance.buildParameters(cfg.parameters, null, false);
        const sendData = {
            targetViewId: cfg.targetViewId,
            pageCode: cfg.targetPageId,
            command: cfg.command,
            commandType: cfg.commandType,
            data: this._componentInstance.buildParameters(cfg.parameters),
        };
        console.log('发送参数', sendData);
        this._componentInstance.componentService.smtRelationSubject.next(sendData);
    }
}