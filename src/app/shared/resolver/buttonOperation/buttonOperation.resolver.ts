import { from } from 'rxjs';
import { map } from 'rxjs/operators';
import { BsnRelativesMessageModel } from 'src/app/core/relations/bsn-relatives';
import { BSN_TRIGGER_TYPE } from 'src/app/core/relations/bsn-status';
import { BSN_DATAGRID_TRIGGER } from 'src/app/core/relations/bsn-trigger/data-list.trigger.interface';
import { BSN_TOOLBAR_TRIGGER } from 'src/app/core/relations/bsn-trigger/toolbar.trigger.interface';
import { ComponentServiceProvider } from 'src/app/core/services/components/component.service';

export class ButtonOperationResolver {
  private _beforeTriggerCfg;
  public get beforeTriggerCfg() {
    return this._beforeTriggerCfg;
  }
  public set beforeTriggerCfg(value) {
    this._beforeTriggerCfg = value;
  }
  private _afterTriggerCfg;
  public get afterTriggerCfg() {
    return this._afterTriggerCfg;
  }
  public set afterTriggerCfg(value) {
    this._afterTriggerCfg = value;
  }
  private _conditionCfg;
  public get conditionCfg() {
    return this._conditionCfg;
  }
  public set conditionCfg(value) {
    this._conditionCfg = value;
  }
  private _ajaxCfg;
  public get ajaxCfg() {
    return this._ajaxCfg;
  }
  public set ajaxCfg(value) {
    this._ajaxCfg = value;
  }
  private _cascade;
  public get cascade() {
    return this._cascade;
  }
  public set cascade(value) {
    this._cascade = value;
  }

  private _currentData;
  public get currentData() {
    return this._currentData;
  }
  public set currentData(value) {
    this._currentData = value;
  }
  private _builtinCfg;
  public get builtinCfg() {
    return this._builtinCfg;
  }
  public set builtinCfg(value) {
    this._builtinCfg = value;
  }

  private _dialogCfg;
  public get dialogCfg() {
    return this._dialogCfg;
  }
  public set dialogCfg(value) {
    this._dialogCfg = value;
  }

  private _windowCfg;
  public get windowCfg() {
    return this._windowCfg;
  }
  public set windowCfg(value) {
    this._windowCfg = value;
  }

  private _changeValueCfg;
  public get changeValueCfg() {
    return this._changeValueCfg;
  }
  public set changeValueCfg(value) {
    this._changeValueCfg = value;
  }

  private _linkConfig;
  public get linkConfig() {
    return this._linkConfig;
  }
  public set linkConfig(value) {
    this._linkConfig = value;
  }

  constructor(private componentService: ComponentServiceProvider, private config: any, private data?: any) {
    config.ajaxConfig && (this.ajaxCfg = config.ajaxConfig);
    config.beforeTrigger && (this.beforeTriggerCfg = config.beforeTrigger);
    config.afterTrigger && (this.afterTriggerCfg = config.afterTrigger);
    config.condition && (this.conditionCfg = config.condition);
    config.cascade && (this.cascade = config.cascade);
    data && (this.currentData = data);
    config.builtinConfig && (this.builtinCfg = config.builtinConfig);
    config.dialog && (this.dialogCfg = config.dialog);
    config.window && (this.windowCfg = config.window);
    config.changeValue && (this.changeValueCfg = config.changeValue);
    config.linkConfig && (this.linkConfig = config.linkConfig);
  }
  public toolbarAction(btn, targetViewId) {
    // ?????????????????????,??????(STATE)?????????(BEHAVIOR)?????????(ACTION)?????????(OPERATION),??????(LINK)
    // ??????: ??????(NEW)?????????(EDIT)?????????(READ_ONLY)
    // ??????: ?????????(DIALOG)?????????(REFRESH)??????????????????(SHOW)
    // ??????: ????????????????????????????????????????????????????????????...
    // ??????:
    // ??????: ????????????(LINK_TO)???????????????(LINK)

    // ?????????????????????????????????????????????????????????
    const btn_source$ = from(btn.execute);
    btn_source$
      .pipe(map((exeCfg) => this.sendBtnMessage(btn, exeCfg, targetViewId)))
      .subscribe()
      .unsubscribe();
  }

  public sendBtnMessage(btn, cfg, targetViewId) {
    const triggerObj = {
      triggerType: cfg.triggerType,
      trigger: cfg.trigger,
    };
    debugger;
    switch (cfg.triggerType) {
      // ????????????
      case BSN_TRIGGER_TYPE.STATE:
        if (this.currentData) {
          this.setDataState(cfg.trigger, this.currentData);
          this.setToggle(this.currentData);
        }
        const state_options: any = {};
        state_options.beforeOperation = this.findBeforeOperationConfig(cfg.stateId);
        state_options.condition = this.findConditionConfig(cfg.conditionId);
        state_options.btnCfg = btn;
        state_options.data = this.currentData;
        if (cfg.builtinId) {
          const _builtinConfig = this.findbuiltinConfig(cfg.builtinId);
          _builtinConfig && (state_options.builtinConfig = _builtinConfig);
        }
        const stateMsg = new BsnRelativesMessageModel(triggerObj, targetViewId, state_options);
        this.componentService.commonRelationTrigger.next(stateMsg);
        break;
      // ????????????
      case BSN_TRIGGER_TYPE.BEHAVIOR:
        if (this.currentData) {
          this.setDataState(cfg.trigger, this.currentData);
          this.setToggle(this.currentData);
        }
        const behavior_options: any = {};
        if (cfg.builtinId) {
          const _builtinConfig = this.findbuiltinConfig(cfg.builtinId);
          _builtinConfig && (behavior_options.builtinConfig = _builtinConfig);
        }
        const behaviorMsg = new BsnRelativesMessageModel(triggerObj, targetViewId, behavior_options);
        this.componentService.commonRelationTrigger.next(behaviorMsg);
        break;
      // ????????????
      case BSN_TRIGGER_TYPE.ACTION:
        console.log('liu___action');
        const action_options: any = {};
        action_options.dialog = this.findConfirmConfig(cfg.dialogId);
        action_options.window = this.findwindowConfig(cfg.windowId);
        action_options.ajaxConfig = this.findAjaxConfig(cfg.ajaxId);
        action_options.condition = this.findConditionConfig(cfg.conditionId);
        action_options.data = this.currentData;
        action_options.btnCfg = btn;
        action_options.changeValue = this.findChangeValueConfig(cfg.changeValueId);
        btn.logInfo && (action_options.logInfo = btn.logInfo);
        if (cfg.builtinId) {
          const _builtinConfig = this.findbuiltinConfig(cfg.builtinId);
          _builtinConfig && (action_options.builtinConfig = _builtinConfig);
        }
        const actionMsg = new BsnRelativesMessageModel(triggerObj, targetViewId, action_options);
        this.componentService.commonRelationTrigger.next(actionMsg);
        break;
      // ????????????
      case BSN_TRIGGER_TYPE.OPERATION:
        // ??????ajax????????????
        // ?????????????????????
        // ????????????????????????
        const options: any = {};
        options.ajaxConfig = this.findAjaxConfig(cfg.ajaxId);
        options.beforeOperation = this.findBeforeOperationConfig(cfg.stateId);
        options.condition = this.findConditionConfig(cfg.conditionId);
        options.data = this.currentData;
        // ??????????????????
        btn.logInfo && (options.logInfo = btn.logInfo);
        if (cfg.builtinId) {
          const _builtinConfig = this.findbuiltinConfig(cfg.builtinId);
          _builtinConfig && (options.builtinConfig = _builtinConfig);
        }
        const operationMsg = new BsnRelativesMessageModel(
          triggerObj,
          targetViewId,
          options, // ??????????????????
        );
        this.componentService.commonRelationTrigger.next(operationMsg);
        break;
      // ??????????????????
      case BSN_TRIGGER_TYPE.LINK:
        const linkOptions: any = {};
        // linkOptions['ajaxConfig'] = this.findAjaxConfig(cfg.ajaxId);
        linkOptions.beforeOperation = this.findBeforeOperationConfig(cfg.stateId);
        linkOptions.condition = this.findConditionConfig(cfg.conditionId);
        linkOptions.linkConfig = this.findLinkConfig(cfg.linkId);
        linkOptions.data = this.currentData;
        const linkMsg = new BsnRelativesMessageModel(
          triggerObj,
          targetViewId,
          linkOptions, // ??????????????????
        );
        this.componentService.commonRelationTrigger.next(linkMsg);
        break;
    }
  }

  private setDataState(state, dataOfState) {
    switch (state) {
      case BSN_DATAGRID_TRIGGER.EDIT_ROW:
        dataOfState.state = 'edit';
        // sendMsg.isSend = false;
        break;
      case BSN_DATAGRID_TRIGGER.EDIT_ROWS:
        dataOfState.state = 'edit';
        // sendMsg.isSend = false;
        break;
      case BSN_DATAGRID_TRIGGER.CANCEL_EDIT_ROW:
        dataOfState.state = 'text';
        dataOfState.validation = true;
        // sendMsg.isSend = true
        break;
      case BSN_DATAGRID_TRIGGER.CANCEL_EDIT_ROWS:
        dataOfState.state = 'text';
        dataOfState.validation = true;
        // sendMsg.isSend = true
        break;
      case BSN_DATAGRID_TRIGGER.ADD_ROW:
        dataOfState.state = 'new';
        dataOfState.validation = true;
        // sendMsg.isSend = true
        break;
      case BSN_DATAGRID_TRIGGER.CANCEL_NEW_ROW:
        dataOfState.state = 'deleted';
        // sendMsg.isSend = true;
        break;
      case BSN_DATAGRID_TRIGGER.CANCEL_NEW_ROWS:
        dataOfState.state = 'text';
        dataOfState.validation = true;
        break;
      case BSN_TOOLBAR_TRIGGER.STATE_TO_TEXT:
        dataOfState.state = 'text';
        dataOfState.validation = true;
        break;
      case BSN_TOOLBAR_TRIGGER.EXECUTE_NONE:
        dataOfState.state = 'text';
        dataOfState.validation = true;
        break;
      case BSN_DATAGRID_TRIGGER.REFRESH:
        dataOfState.state = 'text';
        dataOfState.validation = true;
        break;
    }
  }

  //
  private setToggle(dataOfState) {
    if (Array.isArray(dataOfState.actions) && dataOfState.actions.length > 0) {
      // ????????????
      // ???????????????????????????????????????
      dataOfState.actions.map((action) => {
        this.setToggleByState(action, dataOfState);
      });
    }
    // ??????data??????action??????,?????????????????????????????????
    // ?????????????????????????????????????????????
    // ?????????????????????????????????????????????
  }

  private setToggleByState(action, dataOfState) {
    if (action.toggle && action.toggle.type) {
      switch (action.toggle.type) {
        case 'state':
          const stateValue = dataOfState[action.toggle.type];
          if (action.toggle.values) {
            const valueObj = action.toggle.values.find((val) => val.name === stateValue);
            valueObj && (action[action.toggle.toggleProperty] = valueObj.value);
          }

          break;
        case '...':
          break;
      }
    }
  }

  private setTogglePropertyValue() {}

  private findAjaxConfig(ajaxId) {
    const ApprovalAjax: any = this.componentService.cacheService.getNone('ApprovalInitiateAjax')
      ? this.componentService.cacheService.getNone('ApprovalInitiateAjax')
      : null;
    if (ApprovalAjax !== null && this.ajaxCfg.findIndex((e) => e.id === ajaxId) < 0) {
      this.ajaxCfg = [...this.ajaxCfg, ...ApprovalAjax];
      // this.ajaxCfg.push(ApprovalAjax);
    }
    // this.componentService.cacheService.remove('ApprovalInitiateAjax');
    let ajaxConfig;
    if (this.ajaxCfg && Array.isArray(this.ajaxCfg) && this.ajaxCfg.length > 0) {
      const c = this.ajaxCfg.find((cfg) => cfg.id === ajaxId);
      if (c) {
        ajaxConfig = c;
        if (ajaxConfig.result) {
          for (const r of ajaxConfig.result) {
            // ?????????????????????????????????
            if (this.cascade.messageSender) {
              const senderConfig = this.cascade.messageSender.find((sender) => sender.id === r.senderId);
              if (senderConfig) {
                r.senderCfg = senderConfig;
              }
            }
          }
        }
      }
    }
    return ajaxConfig;
  }

  private findbuiltinConfig(builtinId) {
    let builtinConfig;
    if (this.builtinCfg && Array.isArray(this.builtinCfg) && this.builtinCfg.length > 0) {
      const c = this.builtinCfg.filter((cfg) => cfg.id === builtinId);
      if (c && c.length > 0) {
        builtinConfig = c[0];
      }
    }
    return builtinConfig;
  }

  private findBeforeOperationConfig(stateId) {
    let beforeConfig;
    if (this.beforeTriggerCfg && Array.isArray(this.beforeTriggerCfg) && this.beforeTriggerCfg.length > 0) {
      const b = this.beforeTriggerCfg.filter((cfg) => cfg.id === stateId);
      if (b && b.length > 0) {
        beforeConfig = b[0];
      }
    }
    return beforeConfig;
  }

  private findConditionConfig(conditionId) {
    let conditionConfig;
    if (this.conditionCfg && Array.isArray(this.conditionCfg) && this.conditionCfg.length > 0) {
      const c = this.conditionCfg.filter((cfg) => cfg.id === conditionId);
      if (c && c.length > 0) {
        conditionConfig = c[0];
      }
    }
    return conditionConfig;
  }

  private findConfirmConfig(confirmId) {
    let confirmConfig;
    const ApprovalForm: any[] = this.componentService.cacheService.getNone('ApprovalFormDialog')
      ? this.componentService.cacheService.getNone('ApprovalFormDialog')
      : [];
    if (ApprovalForm.length > 0) {
      this.dialogCfg = [...this.dialogCfg, ...ApprovalForm];
    }
    // this.componentService.cacheService.remove('ApprovalFormDialog');
    if (this.dialogCfg && Array.isArray(this.dialogCfg) && this.dialogCfg.length > 0) {
      const c = this.dialogCfg.find((cfg) => cfg.id === confirmId);
      if (c) {
        confirmConfig = c;
      }
    }
    return confirmConfig;
  }

  private findwindowConfig(windowId) {
    let windowConfig;
    if (this.windowCfg && Array.isArray(this.windowCfg) && this.windowCfg.length > 0) {
      const c = this.windowCfg.find((cfg) => cfg.id === windowId);
      if (c) {
        windowConfig = c;
      }
    }
    return windowConfig;
  }

  private findChangeValueConfig(changeValueId) {
    let changeValueConfig;
    if (this.changeValueCfg && Array.isArray(this.changeValueCfg) && this.changeValueCfg.length > 0) {
      const c = this.changeValueCfg.find((cfg) => cfg.id === changeValueId);
      if (c) {
        changeValueConfig = c;
      }
    }
    return changeValueConfig;
  }

  private findLinkConfig(linkId) {
    let linkConfig;
    if (this.linkConfig && Array.isArray(this.linkConfig) && this.linkConfig.length > 0) {
      const c = this.linkConfig.find((cfg) => cfg.id === linkId);
      if (c) {
        linkConfig = c;
      }
    }
    return linkConfig;
  }
}
