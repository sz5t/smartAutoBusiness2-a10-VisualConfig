import { async } from '@angular/core/testing';
import { ISenderModel } from 'src/app/core/relations/bsn-relatives';
import { SmtPreCondition } from '../smt-pre-condition/smt-pre-condition.resolver';
import { SmtMessageSenderResolver } from '../smt-relation/smt-relation-resolver';

// 命令解析，命令只关注于接收命令组件执行的方法，只有很少数的方法需要必须的参数传递，大部分的方法只需要调用方法执行即可

export class SmtCommandResolver {
  constructor(private _componentInstance: any) {}
  public resolve(customCommand: any[]): any {
    if (!this._componentInstance.subscription$) {
      console.log('==========》subscription');
      // debugger;
      this._componentInstance.subscription$ = this._componentInstance.componentService.smtRelationSubject.subscribe(
        (eventData: ISenderModel) => {
          console.log('commandItem');
          customCommand.map(async (cmdItem: any) => {
            // debugger;
            if (cmdItem.command === eventData.command && eventData.pageCode === this._componentInstance.dataServe.pageCode) {
              // 缺少pageCode 判断
              await this._executeCommand(eventData.data, cmdItem);
            }
          });
        },
      );
    }
  }

  private async _executeCommand(eventData: any, cmd: any) {
    if (cmd.preCondition) {
    }
    let _execParamsData: any = {};
    if (cmd.declareParameters && cmd.declareParameters.length > 0) {
      const declareParamValue = this._componentInstance.buildParameters(cmd.declareParameters, eventData, false);
      cmd.declareParameters.map((p: any) => {
        if (p.valueTo && this._componentInstance[p.valueTo]) {
          this._componentInstance[p.valueTo][p.name] = declareParamValue[p.name];
        }
      });
      _execParamsData = { ...declareParamValue, ..._execParamsData };
    }
    if (cmd.localParameters && cmd.localParameters.length > 0) {
      const localParamValue = this._componentInstance.buildParameters(cmd.localParameters);
      cmd.localParameters.map((p: any) => {
        if (p.valueTo && this._componentInstance[p.valueTo]) {
          this._componentInstance[p.valueTo][p.name] = localParamValue[p.name];
        }
      });

      _execParamsData = { ...localParamValue, ..._execParamsData };
    }
    // 执行命令
    if (cmd.commandType === 'builtin') {
      const method = this._componentInstance.COMPONENT_METHODS[cmd.command];
      const result = await this._componentInstance[method](_execParamsData);
      if (result.state === 1) {
        this.showDefaultMessage();
      }
    } else if (cmd.commandType === 'custom') {
      cmd.commandContent.forEach(async (command) => {
        if (command.type === 'ajaxConfig') {
          const data = _execParamsData === {} ? null : _execParamsData;
          const response = await this._componentInstance.executeHttp(command.ajaxConfig, data, null);
          if (response.state === 1) {
            for (let i = 0; i < command.result.length; i++) {
              // if (command.result[i]['enableCondition'] === 'true') {
              // }
              this.afterOperate(command.result[i], this._componentInstance.componentService.modalService);
            }
          }
        } else if (command.type === 'commandConfig') {
          for (let i = 0; i < command.commandConfig.length; i++) {
            if (command.commandConfig[i].commandType === 'custom') {
              new SmtMessageSenderResolver(this._componentInstance).resolve(command.commandConfig[i]);
            } else {
              const method = this._componentInstance.COMPONENT_METHODS[command.commandConfig[i].command];
              const result = await this._componentInstance[method](_execParamsData);
              if (result.state === 1) {
                this.showDefaultMessage();
              }
            }
          }

          for (let j = 0; j < command.result.length; j++) {
            this.afterOperate(command.result[j], this._componentInstance.componentService.modalService);
          }
        }
      });
    }
  }

  public afterOperate(commandObj, modal) {
    if (commandObj['preCondition'] && commandObj['preCondition'].length > 0) {
      const beforeOperation = new SmtPreCondition(this._componentInstance).resolverBeforeOperationInfo(
        commandObj.preCondition,
        this._componentInstance.componentService.modalService,
      );
      if (beforeOperation) {
        this.resultResolver(commandObj, modal);
      } else {
        return;
      }
    } else {
      this.resultResolver(commandObj, modal);
    }
  }

  private resultResolver(result, modal) {
    let nextOperate: any;
    let returnValue: any;
    switch (result['type']) {
      case 'message':
        nextOperate = this.showMessage(result['message'], returnValue, modal);
        break;
      case 'confirm':
        nextOperate = this.showConfirm(result['confirm'], returnValue, modal);
        break;
      case 'execution':
        nextOperate = this.showExecution(result['execution'], returnValue);
        break;
    }
    return nextOperate;
  }

  // 根据前置条件展示提示框
  showMessage(cfg, returnValue, modal) {
    modal['message']({
      nzTitle: cfg['messageInfo']['title'] ? cfg['messageInfo']['title'] : '提示',
      nzContent: this.createContent(cfg['messageInfo']),
    });
    returnValue = this.nextOperate(cfg['messageInfo']['point']);
    return returnValue;
  }

  showConfirm(cfg, returnValue, modal) {
    modal['confirm']({
      nzTitle: cfg['contentInfo']['title'] ? cfg['contentInfo']['title'] : '提示',
      nzContent: this.createContent(cfg['contentInfo']),
      nzOkText: cfg['okInfo']['title'],
      nzCancelText: cfg['cancelInfo']['title'],
      nzOnOk: () => {
        returnValue = this.nextOperate(cfg['okInfo']['point']);
      },
      nzOnCancel: () => {
        returnValue = this.nextOperate(cfg['cancelInfo']['point']);
      },
    });
    return returnValue;
  }

  showExecution(cfg, returnValue) {
    returnValue = this.nextOperate(cfg['point']);
    return returnValue;
  }

  createContent(cfg) {
    let content = cfg['content'];
    let params;
    let array;
    if (cfg['parameters'].length > 0) {
      params = this._componentInstance.buildParameters(cfg['parameters'], null, false);
      array = cfg['content'].match(/{(\S*)}/);
      for (let i = 1; i < array.length; i++) {
        const tempName = array[i];
        const repalceString = '{' + tempName + '}';
        content = content.replace(repalceString, params[tempName]);
      }
    }
    return content;
  }

  nextOperate(type) {
    return type;
  }

  showDefaultMessage() {
    this._componentInstance.componentService.modalService.success({
      nzTitle: '提示',
      nzContent: '执行成功',
    });
  }
}
