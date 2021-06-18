import { from } from 'rxjs';
import { map } from 'rxjs/operators';
import { BsnCommandMessageModel, ISenderModel } from 'src/app/core/relations/bsn-relatives';

export class SmtEventResolver {
  constructor(private _componentInstance: any) {}
  public resolve(componentEvents: any[]): any {
    // debugger;
    if (componentEvents && Array.isArray(componentEvents) && componentEvents.length > 0) {
      const source$ = from(componentEvents);
      const subscribe$ = source$.pipe(
        map((evt: any) => {
          this._resolveEventContent(evt.eventName, evt.eventContent);
        }),
      );
      return subscribe$;
    }
  }

  private _resolveEventContent(eventName: string, eventContent: any) {
    // 判断前置条件
    if (eventContent && eventContent.length > 0) {
      new ComponentEventSender(this._componentInstance).sendEvent(eventName, eventContent);
    }
  }
}

export class ComponentEventSender {
  constructor(private _componentInstance: any) {}

  public sendEvent(eventName: string, eventContent: any[]) {
    this._componentInstance['after'](this._componentInstance, this._componentInstance.COMPONENT_METHODS[eventName], () => {
      eventContent.map((evt: any) => {
        if (evt.preCondition) {
          this._resolvePreCondition(evt.preCondition);
        }
        if (evt.targetViewId && evt.command && evt.commandType) {
          const sendData = {
            targetViewId: evt.targetViewId,
            pageCode: this._componentInstance.dataServe.pageCode,
            command: evt.command,
            data: this._componentInstance.buildParameters(evt.parameters),
          };
          console.log('sendmessage', sendData);
          this._componentInstance.componentService.smtRelationSubject.next(sendData);
        }
      });
    });
  }

  private _resolvePreCondition(condition: any[]) {}
}
export class ComponentCommandSender {
  constructor(private _componentInstance: any) {}

  public sendEvent(eventName: string, command) {
    this._componentInstance['after'](this._componentInstance, this._componentInstance.COMPONENT_METHODS[eventName], () => {
      const sendData = {
        targetViewId: command.targetViewId,
        pageCode: command.pageCode,
        command: command.command,
        data: this._componentInstance.buildParameters(command.parameters),
      };
      console.log('sendmessage', sendData);
      this._componentInstance.componentService.smtRelationSubject.next(sendData);
    });
  }
}
