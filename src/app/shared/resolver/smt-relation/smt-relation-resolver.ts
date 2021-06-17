import { from } from "rxjs";
import { map } from "rxjs/operators";
import { BsnCommandMessageModel } from "src/app/core/relations/bsn-relatives";
import { SmtPreCondition } from "../smt-pre-condition/smt-pre-condition.resolver";

export class SmtMessageSenderEnterResolver {
    constructor(private _componentInstance: any) {
    }
    // 这个地方只进行注册发消息
    public resolve(eventArray) {
        eventArray.map((event) => {
            event.eventContent.map((command) => {
                // 前置判断
                if (command.preCondition && command.preCondition.length > 0) {
                    const condition = new SmtPreCondition(this._componentInstance).resolverBeforeOperationInfo(command.preCondition, this._componentInstance.componentService.modalService)
                    if (condition) {
                        command.condition = condition;
                    }
                }
            });
        });

        let source$: any;
        // for (let i = 0; i < eventArray.length; i++) {
        // const content = eventArray[i]['eventContent'];
        const sender_source$ = from(eventArray);
        const sender_subscribe$ = sender_source$.pipe(
            map((cfg) => {
                // 根据当前表格实例的类型,进行相应消息的注册
                // console.log('single sender cfg', cfg);
                // tslint:disable-next-line: no-use-before-declare
                new SmtMessageSenderResolver(this._componentInstance).resolve(cfg);
            }),
        );
        source$ = sender_subscribe$;
        return source$;
    }
    // }
}

export class SmtMessageSenderResolver {
    constructor(private _componentInstance: any) { }
    public resolve(cfg) {
        const commandParams = this._componentInstance.buildParameters(cfg.parameters, null, false);
        console.log('发送参数', commandParams, cfg['command'], this._componentInstance.dataServe['pageCode'], this._componentInstance.config.id);
        this._componentInstance.componentService.commonRelationSubject.next(
            new BsnCommandMessageModel(
                cfg['command'],
                this._componentInstance.dataServe['pageCode'],
                this._componentInstance.config.id,
                commandParams,
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