import { BsnCommandMessageModel } from "src/app/core/relations/bsn-relatives";

export class SmtMessageSenderResolver {
    constructor(private _componentInstance: any) { }
    public resolve(cfg) {
        // const commandParams = this._componentInstance.buildParameters(cfg.parameters, null, false);
        console.log('发送参数', cfg['command'], cfg['targetViewId'], cfg['targetPageId'], cfg.parameters);
        this._componentInstance.componentService.smtRelationSubject.next(
            new BsnCommandMessageModel(
                cfg['command'],
                cfg['targetPageId'],
                cfg['targetViewId'],
                cfg.parameters,
                cfg.commandType
            )
        );
    }
}

export class SmtMessageReceiverResolver {
    constructor(private _componentInstance: any) { }
    public resolve(customCommand) {
        customCommand.forEach(command => {
            if (command['commandName']) {
                if (!this._componentInstance.subscription$) {
                    this._componentInstance.subscription$ = this._componentInstance.componentService.commonRelationSubject.subscribe((data) => {
                        // command['commandContent'].map((cfg) => {
                        // 判断发送组件与接受组件是否一致
                        if (data.commandId === command['commandName'] && data.sendComponent === this._componentInstance.config.id) {
                            // 判断发送触发器与接受触发起是否一致
                            // new TriggerResolver(
                            //     data,
                            //     this._componentInstance
                            // ).resolve();
                            this.exec(this._componentInstance, data);
                        }
                        // });
                    });
                }
            }
        });
    }

    private exec(componentInstance, data) {
        componentInstance['operateReceiveCommand'](data.commandId, data.commandParams);
    }
}